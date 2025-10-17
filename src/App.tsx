import { useState, useRef } from 'react';
import { Save, Download, RotateCcw, FileText, Upload, X } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Resume, FormattingSettings } from './types/resume';
import { SelectionPage } from './components/SelectionPage';
import { ResumePreview } from './components/ResumePreview';
import { EditorSidebar } from './components/EditorSidebar';
import { SECTION_TEMPLATES } from './constants/sections';

function App() {
  const [step, setStep] = useState<'selection' | 'studio'>('selection');
  const [activeResume, setActiveResume] = useState<Resume | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [undoHistory, setUndoHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const [activeTab, setActiveTab] = useState<'design' | 'formatting' | 'sections' | 'ai'>('design');
  const [selectedTemplateId, setSelectedTemplateId] = useState('classic-1');
  const [formattingSettings, setFormattingSettings] = useState<FormattingSettings>({
    alignment: 'left',
    textColor: '#334155',
    highlightColor: 'transparent',
    fontStyle: 'Inter',
    fontSize: 11,
    headingSize: 14,
    sectionSpacing: 16,
    paragraphSpacing: 8,
    lineSpacing: 1.4,
    topBottomMargin: 20,
    sideMargins: 20,
    paragraphIndent: 0
  });
  const [activeSections, setActiveSections] = useState<Array<{ id: string; name: string }>>([
    { id: 'heading-1', name: 'Heading' },
    { id: 'profile-1', name: 'Profile' },
    { id: 'core-skills-1', name: 'Core Skills' },
    { id: 'experience-1', name: 'Experience' },
    { id: 'education-1', name: 'Education' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importError, setImportError] = useState('');

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartFromScratch = async () => {
    const initialContent = activeSections
      .map(section => {
        const template = SECTION_TEMPLATES[section.name] || '';
        return template.replace('data-section-name="', `data-section-id="${section.id}" data-section-name="`);
      })
      .join('');

    const newResume: Partial<Resume> = {
      title: 'New Resume',
      type: 'master',
      content: initialContent,
      ats_score: 0,
      template_id: selectedTemplateId,
      colors: { primary: '#3B82F6', secondary: '#64748B', accent: '#8B5CF6' },
      formatting: formattingSettings,
      active_sections: activeSections,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('resumes')
          .insert([{ ...newResume, user_id: user.id }])
          .select()
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setActiveResume(data);
          setEditorContent(data.content);
          setUndoHistory([data.content]);
          setHistoryPointer(0);
        }
      } else {
        const localResume: Resume = {
          ...newResume as Resume,
          id: 'local-' + Date.now()
        };
        setActiveResume(localResume);
        setEditorContent(localResume.content);
        setUndoHistory([localResume.content]);
        setHistoryPointer(0);
      }

      setStep('studio');
    } catch (error) {
      console.error('Error creating resume:', error);
      const localResume: Resume = {
        ...newResume as Resume,
        id: 'local-' + Date.now()
      };
      setActiveResume(localResume);
      setEditorContent(localResume.content);
      setUndoHistory([localResume.content]);
      setHistoryPointer(0);
      setStep('studio');
    }
  };

  const handleImport = () => {
    setShowImportModal(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        setImportError('Please select a valid file type (PDF, DOCX, DOC, or TXT)');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setImportError('File size must be less than 10MB');
        return;
      }

      setImportFile(file);
      setImportError('');
    }
  };

  const processImportedFile = async () => {
    if (!importFile) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockContent = `<div class="resume-section" data-section-name="Heading"><p><b>JOHN DOE</b></p><p>Software Engineer</p><p>john.doe@email.com | (555) 123-4567 | LinkedIn: linkedin.com/in/johndoe</p></div><div class="resume-section" data-section-name="Profile"><p><br></p><p><b>PROFESSIONAL SUMMARY</b></p><p>Experienced software engineer with 5+ years developing scalable web applications using React, Node.js, and cloud technologies.</p></div><div class="resume-section" data-section-name="Core Skills"><p><br></p><p><b>CORE SKILLS</b></p><p>• Frontend: React, TypeScript, JavaScript</p><p>• Backend: Node.js, Python, Express.js</p><p>• Cloud: AWS, Docker, Kubernetes</p></div><div class="resume-section" data-section-name="Experience"><p><br></p><p><b>EXPERIENCE</b></p><p>Senior Software Engineer | TechCorp Inc. | 2022-Present</p><p>• Led development of microservices architecture serving 100K+ users</p><p>• Implemented CI/CD pipelines reducing deployment time by 60%</p></div><div class="resume-section" data-section-name="Education"><p><br></p><p><b>EDUCATION</b></p><p>Bachelor of Science in Computer Science</p><p>University Name | 2018</p></div>`;

      const newResume: Partial<Resume> = {
        title: importFile.name.replace(/\.[^/.]+$/, ''),
        type: 'master',
        content: mockContent,
        ats_score: 75,
        template_id: selectedTemplateId,
        colors: { primary: '#3B82F6', secondary: '#64748B', accent: '#8B5CF6' },
        formatting: formattingSettings,
        active_sections: activeSections,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from('resumes')
            .insert([{ ...newResume, user_id: user.id }])
            .select()
            .maybeSingle();

          if (error) throw error;
          if (data) {
            setActiveResume(data);
            setEditorContent(data.content);
            setUndoHistory([data.content]);
            setHistoryPointer(0);
          }
        } else {
          const localResume: Resume = {
            ...newResume as Resume,
            id: 'local-' + Date.now()
          };
          setActiveResume(localResume);
          setEditorContent(localResume.content);
          setUndoHistory([localResume.content]);
          setHistoryPointer(0);
        }
      } catch (error) {
        console.error('Error saving to Supabase:', error);
        const localResume: Resume = {
          ...newResume as Resume,
          id: 'local-' + Date.now()
        };
        setActiveResume(localResume);
        setEditorContent(localResume.content);
        setUndoHistory([localResume.content]);
        setHistoryPointer(0);
      }

      setShowImportModal(false);
      setImportFile(null);
      setStep('studio');
    } catch (error) {
      setImportError('Failed to process the uploaded file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = (newContent: string) => {
    if (newContent !== editorContent) {
      const newHistory = undoHistory.slice(0, historyPointer + 1);
      newHistory.push(newContent);
      setUndoHistory(newHistory);
      setHistoryPointer(newHistory.length - 1);
      setEditorContent(newContent);
    }
  };

  const handleUndo = () => {
    if (historyPointer > 0) {
      const newPointer = historyPointer - 1;
      setHistoryPointer(newPointer);
      setEditorContent(undoHistory[newPointer]);
    }
  };

  const handleSave = async () => {
    if (!activeResume) return;

    setIsLoading(true);
    try {
      if (!activeResume.id.startsWith('local-')) {
        const { error } = await supabase
          .from('resumes')
          .update({
            content: editorContent,
            formatting: formattingSettings,
            active_sections: activeSections,
            template_id: selectedTemplateId,
            updated_at: new Date().toISOString()
          })
          .eq('id', activeResume.id);

        if (error) throw error;
      }

      setActiveResume({
        ...activeResume,
        content: editorContent,
        formatting: formattingSettings,
        active_sections: activeSections,
        template_id: selectedTemplateId,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving resume:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormattingChange = (key: keyof FormattingSettings, value: any) => {
    setFormattingSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleAddSection = (sectionName: string) => {
    const sectionId = `${sectionName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const newSection = { id: sectionId, name: sectionName };
    setActiveSections([...activeSections, newSection]);

    const sectionContent = SECTION_TEMPLATES[sectionName];
    if (sectionContent) {
      const contentWithId = sectionContent.replace('data-section-name="', `data-section-id="${sectionId}" data-section-name="`);
      const newContent = editorContent + contentWithId;
      handleContentChange(newContent);
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    setActiveSections(activeSections.filter(section => section.id !== sectionId));

    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = editorContent;

    const sectionToRemove = tempContainer.querySelector(
      `.resume-section[data-section-id="${sectionId}"]`
    );

    if (sectionToRemove) {
      sectionToRemove.remove();
      handleContentChange(tempContainer.innerHTML);
    }
  };

  const handleReorderSections = (newOrder: Array<{ id: string; name: string }>) => {
    setActiveSections(newOrder);

    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = editorContent;

    const sectionElements = new Map<string, Element>();
    tempContainer.querySelectorAll('.resume-section').forEach((element) => {
      const sectionId = element.getAttribute('data-section-id');
      if (sectionId) {
        sectionElements.set(sectionId, element);
      }
    });

    tempContainer.innerHTML = '';

    newOrder.forEach((section) => {
      const element = sectionElements.get(section.id);
      if (element) {
        tempContainer.appendChild(element.cloneNode(true));
      }
    });

    handleContentChange(tempContainer.innerHTML);
  };

  const applyFormat = (command: string, value?: string) => {
    if (!editorRef.current) return;

    const alignmentCommands: Record<string, string> = {
      justifyLeft: 'left',
      justifyCenter: 'center',
      justifyRight: 'right'
    };

    if (command in alignmentCommands) {
      const alignment = alignmentCommands[command];
      editorRef.current.focus();
      const selection = window.getSelection();
      if (!selection?.rangeCount) return;

      const range = selection.getRangeAt(0);
      const editorNode = editorRef.current;

      if (!editorNode.contains(range.commonAncestorContainer)) return;

      const paragraphsToAlign = new Set<HTMLElement>();
      const allParagraphs = editorNode.querySelectorAll('p');
      allParagraphs.forEach(p => {
        if (range.intersectsNode(p)) {
          paragraphsToAlign.add(p);
        }
      });

      if (paragraphsToAlign.size === 0 && range.collapsed) {
        let currentNode: Node | null = range.startContainer;
        while (currentNode && currentNode !== editorNode) {
          if (currentNode.nodeName === 'P') {
            paragraphsToAlign.add(currentNode as HTMLElement);
            break;
          }
          currentNode = currentNode.parentNode;
        }
      }

      paragraphsToAlign.forEach(p => {
        p.style.textAlign = alignment;
      });
    } else {
      editorRef.current.focus();
      document.execCommand(command, false, value);
    }

    handleContentChange(editorRef.current.innerHTML);
  };

  const applyTextColor = (color: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('foreColor', false, color);
      handleContentChange(editorRef.current.innerHTML);
    }
  };

  const handleATSOptimization = async () => {
    if (!activeResume) return;
    setAiProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newScore = Math.min(100, activeResume.ats_score + 10);
    setActiveResume({ ...activeResume, ats_score: newScore });
    setAiProcessing(false);
  };

  const handleEnhanceText = async () => {
    setAiProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAiProcessing(false);
  };

  const handleGapJustification = async () => {
    setAiProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAiProcessing(false);
  };

  if (step === 'selection') {
    return (
      <>
        <SelectionPage onImport={handleImport} onStartFromScratch={handleStartFromScratch} />

        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl rounded-2xl border bg-white">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-slate-900">Import Resume</h3>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="p-2 rounded-lg transition-colors text-slate-400 hover:text-slate-900 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="border-2 border-dashed rounded-xl p-8 text-center transition-colors border-gray-300 hover:border-blue-400">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="resume-file-input"
                  />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-2 text-slate-900">
                        {importFile ? importFile.name : 'Choose your resume file'}
                      </h4>
                      <p className="text-sm text-slate-500">PDF, DOCX, DOC, or TXT (Max 10MB)</p>
                    </div>
                    <label
                      htmlFor="resume-file-input"
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                      Select File
                    </label>
                  </div>
                </div>
                {importError && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{importError}</p>
                  </div>
                )}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-slate-700 rounded-lg hover:border-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={processImportedFile}
                    disabled={!importFile || isLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Importing...' : 'Import Resume'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="grid grid-cols-[auto_1fr] bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl overflow-hidden h-screen">
      <EditorSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        formatting={formattingSettings}
        onFormattingChange={handleFormattingChange}
        selectedTemplateId={selectedTemplateId}
        onTemplateChange={setSelectedTemplateId}
        activeSections={activeSections}
        onAddSection={handleAddSection}
        onDeleteSection={handleDeleteSection}
        onDuplicateSection={(sectionId: string) => {
          const section = activeSections.find(s => s.id === sectionId);
          if (section) {
            const newSectionId = `${section.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
            const newSection = { id: newSectionId, name: section.name };
            const sectionIndex = activeSections.findIndex(s => s.id === sectionId);
            const newSections = [...activeSections];
            newSections.splice(sectionIndex + 1, 0, newSection);
            setActiveSections(newSections);

            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = editorContent;
            const sectionElement = tempContainer.querySelector(`.resume-section[data-section-id="${sectionId}"]`);

            if (sectionElement) {
              const clonedElement = sectionElement.cloneNode(true) as HTMLElement;
              clonedElement.setAttribute('data-section-id', newSectionId);
              sectionElement.parentNode?.insertBefore(clonedElement, sectionElement.nextSibling);
              handleContentChange(tempContainer.innerHTML);
            }
          }
        }}
        onReorderSections={handleReorderSections}
        onApplyFormat={applyFormat}
        onApplyTextColor={applyTextColor}
        activeResume={activeResume}
        aiProcessing={aiProcessing}
        onATSOptimization={handleATSOptimization}
        onEnhanceText={handleEnhanceText}
        onGapJustification={handleGapJustification}
      />

      <div className="flex flex-col overflow-y-auto">
        <div className="bg-white/80 backdrop-blur-sm p-4 flex-shrink-0 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-slate-900">
                {activeResume?.title || 'Resume Editor'}
              </h3>
              {activeResume && (
                <div className="px-2 py-1 rounded-full text-xs font-medium text-blue-700 bg-blue-100">
                  ATS: {activeResume.ats_score}%
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={historyPointer <= 0}
                className="flex items-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Undo
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-sm"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setShowExportModal(true)}
                disabled={!activeResume}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-sm"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <ResumePreview
            content={editorContent}
            formatting={formattingSettings}
            onContentChange={handleContentChange}
            editorRef={editorRef}
            onReorderSections={handleReorderSections}
          />
        </div>
      </div>

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Export Resume</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-slate-600">Choose your preferred export format:</p>
              <div className="space-y-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="w-full flex items-center gap-3 p-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Download as PDF</div>
                    <div className="text-sm opacity-80">Best for online applications</div>
                  </div>
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="w-full flex items-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Download as Word</div>
                    <div className="text-sm opacity-80">Editable document format</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
