import { useState } from 'react';
import {
  Shield,
  Sparkles,
  Clock,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Indent,
  Outdent,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  X,
  GripVertical
} from 'lucide-react';
import { FormattingSettings, Resume } from '../types/resume';
import { TEMPLATES, COLOR_PALETTES, FONT_STYLES } from '../constants/templates';
import { AVAILABLE_SECTIONS } from '../constants/sections';

interface EditorSidebarProps {
  activeTab: 'design' | 'formatting' | 'sections' | 'ai';
  onTabChange: (tab: 'design' | 'formatting' | 'sections' | 'ai') => void;
  formatting: FormattingSettings;
  onFormattingChange: (key: keyof FormattingSettings, value: any) => void;
  selectedTemplateId: string;
  onTemplateChange: (templateId: string) => void;
  activeSections: string[];
  onAddSection: (section: string) => void;
  onDeleteSection: (section: string) => void;
  onReorderSections: (newOrder: string[]) => void;
  onApplyFormat: (command: string, value?: string) => void;
  onApplyTextColor: (color: string) => void;
  activeResume: Resume | null;
  aiProcessing: boolean;
  onATSOptimization: () => void;
  onEnhanceText: () => void;
  onGapJustification: () => void;
}

export function EditorSidebar({
  activeTab,
  onTabChange,
  formatting,
  onFormattingChange,
  selectedTemplateId,
  onTemplateChange,
  activeSections,
  onAddSection,
  onDeleteSection,
  onReorderSections,
  onApplyFormat,
  onApplyTextColor,
  activeResume,
  aiProcessing,
  onATSOptimization,
  onEnhanceText,
  onGapJustification
}: EditorSidebarProps) {
  const [templateCategory, setTemplateCategory] = useState<'all' | 'classic' | 'modern' | 'photo'>('all');
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);

  const filteredTemplates = templateCategory === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === templateCategory);

  return (
    <div className="w-96 bg-white/80 backdrop-blur-sm flex flex-col border-r border-gray-200">
      <div className="p-4 flex-shrink-0">
        <div className="grid grid-cols-2 gap-1 bg-gray-100 rounded-lg p-1 mt-4">
          <button
            onClick={() => onTabChange('design')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'design' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-gray-200'
            }`}
          >
            Design
          </button>
          <button
            onClick={() => onTabChange('formatting')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'formatting' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-gray-200'
            }`}
          >
            Formatting
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1 bg-gray-100 rounded-lg p-1 mt-2">
          <button
            onClick={() => onTabChange('sections')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'sections' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-gray-200'
            }`}
          >
            Sections
          </button>
          <button
            onClick={() => onTabChange('ai')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'ai' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-gray-200'
            }`}
          >
            AI Copilot
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar min-h-0">
        {activeTab === 'design' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Templates</h4>
              <div className="flex flex-wrap gap-1 mb-4">
                {(['all', 'classic', 'photo', 'modern'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setTemplateCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                      templateCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-slate-600 hover:bg-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {filteredTemplates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => onTemplateChange(template.id)}
                    className={`p-2 rounded-lg border transition-all ${
                      selectedTemplateId === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className={`w-full h-20 rounded mb-2 ${template.preview}`}></div>
                    <h5 className="text-xs font-medium text-slate-800">{template.name}</h5>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'formatting' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Text & Paragraph</h4>
              <div className="flex items-center flex-wrap gap-1 bg-gray-100 rounded-lg p-1 mb-3">
                <button
                  onClick={() => onApplyFormat('bold')}
                  className="p-2 rounded-md transition-colors hover:bg-gray-200 text-slate-600"
                >
                  <Bold className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onApplyFormat('italic')}
                  className="p-2 rounded-md transition-colors hover:bg-gray-200 text-slate-600"
                >
                  <Italic className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onApplyFormat('underline')}
                  className="p-2 rounded-md transition-colors hover:bg-gray-200 text-slate-600"
                >
                  <Underline className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button
                  onClick={() => onApplyFormat('insertUnorderedList')}
                  className="p-2 rounded-md transition-colors hover:bg-gray-200 text-slate-600"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onApplyFormat('insertOrderedList')}
                  className="p-2 rounded-md transition-colors hover:bg-gray-200 text-slate-600"
                >
                  <ListOrdered className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button
                  onClick={() => onApplyFormat('outdent')}
                  className="p-2 rounded-md transition-colors hover:bg-gray-200 text-slate-600"
                >
                  <Outdent className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onApplyFormat('indent')}
                  className="p-2 rounded-md transition-colors hover:bg-gray-200 text-slate-600"
                >
                  <Indent className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">Accent Colors</h4>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PALETTES.map(palette => (
                    <button
                      key={palette.name}
                      onClick={() => onApplyTextColor(palette.primary)}
                      className="w-6 h-6 rounded-full border-2 transition-all border-gray-300 hover:border-blue-500"
                      style={{ backgroundColor: palette.primary }}
                      title={palette.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Alignment & Layout</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-2">Text Alignment</label>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => onApplyFormat('justifyLeft')}
                      className="p-2 w-full rounded-md transition-colors hover:bg-gray-200 text-slate-600"
                    >
                      <AlignLeft className="w-5 h-5 mx-auto" />
                    </button>
                    <button
                      onClick={() => onApplyFormat('justifyCenter')}
                      className="p-2 w-full rounded-md transition-colors hover:bg-gray-200 text-slate-600"
                    >
                      <AlignCenter className="w-5 h-5 mx-auto" />
                    </button>
                    <button
                      onClick={() => onApplyFormat('justifyRight')}
                      className="p-2 w-full rounded-md transition-colors hover:bg-gray-200 text-slate-600"
                    >
                      <AlignRight className="w-5 h-5 mx-auto" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-2">
                    Line Spacing: {formatting.lineSpacing}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="2"
                    step="0.1"
                    value={formatting.lineSpacing}
                    onChange={e => onFormattingChange('lineSpacing', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-2">Side Margins</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="10"
                      max="40"
                      value={formatting.sideMargins}
                      onChange={e => onFormattingChange('sideMargins', Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="relative">
                      <input
                        type="number"
                        value={formatting.sideMargins}
                        onChange={e => onFormattingChange('sideMargins', Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-white border border-gray-300 rounded-md text-center text-sm"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                        mm
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Font Formatting</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-2">Font Style</label>
                  <select
                    value={formatting.fontStyle}
                    onChange={e => onFormattingChange('fontStyle', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-slate-800 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    {FONT_STYLES.map(font => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-2">
                    Font Size: {formatting.fontSize}pt
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="16"
                    value={formatting.fontSize}
                    onChange={e => onFormattingChange('fontSize', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-800 mb-3">Resume Sections</h4>
            <div className="space-y-2 mb-6">
              {activeSections.map((section) => {
                const isDragging = draggedSection === section;
                const isOver = dragOverSection === section;
                return (
                  <div key={section}>
                    {isOver && draggedSection && draggedSection !== section && (
                      <div className="h-12 bg-blue-100 border-2 border-dashed border-blue-400 rounded-lg mb-2 flex items-center justify-center text-xs text-blue-600 font-medium">
                        Drop here
                      </div>
                    )}
                    <div
                      draggable
                      onDragStart={(e) => {
                        setDraggedSection(section);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggedSection && draggedSection !== section) {
                          setDragOverSection(section);
                        }
                      }}
                      onDragLeave={() => {
                        setDragOverSection(null);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedSection && draggedSection !== section) {
                          const draggedIndex = activeSections.indexOf(draggedSection);
                          const targetIndex = activeSections.indexOf(section);
                          const newSections = [...activeSections];
                          newSections.splice(draggedIndex, 1);
                          newSections.splice(targetIndex, 0, draggedSection);
                          onReorderSections(newSections);
                        }
                        setDraggedSection(null);
                        setDragOverSection(null);
                      }}
                      onDragEnd={() => {
                        setDraggedSection(null);
                        setDragOverSection(null);
                      }}
                      className={`flex items-center gap-2 p-3 rounded-lg border transition-all cursor-move ${
                        isDragging
                          ? 'opacity-40 scale-95 border-blue-400 bg-blue-50'
                          : 'border-green-500 bg-green-50'
                      }`}
                    >
                      <GripVertical className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-green-700 flex-1">{section}</span>
                      <button
                        onClick={() => onDeleteSection(section)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-gray-300 pt-4">
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Add Section</h4>
              <div className="space-y-2">
                {AVAILABLE_SECTIONS.filter(section => !activeSections.includes(section)).map(section => (
                  <div
                    key={section}
                    className="flex items-center justify-between p-3 rounded-lg border transition-colors border-gray-300 bg-gray-50 hover:bg-gray-100"
                  >
                    <span className="text-sm text-slate-700">{section}</span>
                    <button
                      onClick={() => onAddSection(section)}
                      className="text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-3">AI Copilot</h4>
              {activeResume ? (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-800">ATS Score:</span> {activeResume.ats_score}%
                  </p>
                  <p className="mt-1">AI suggestions will appear here based on your resume content.</p>
                </div>
              ) : (
                <div className="p-3 bg-gray-100 border border-gray-200 rounded-lg text-sm text-slate-500">
                  Select a resume to activate AI Copilot.
                </div>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={onATSOptimization}
                disabled={!activeResume || aiProcessing}
                className="w-full flex items-center gap-3 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Shield className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-slate-800 text-left">ATS Optimization</p>
                  <p className="text-xs text-slate-500 text-left">
                    Improve your score against tracking systems.
                  </p>
                </div>
              </button>
              <button
                onClick={onEnhanceText}
                disabled={aiProcessing}
                className="w-full flex items-center gap-3 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-slate-800 text-left">Enhance Selected Text</p>
                  <p className="text-xs text-slate-500 text-left">
                    Rewrite text for more impact. Select text to enable.
                  </p>
                </div>
              </button>
              <button
                onClick={onGapJustification}
                disabled={!activeResume || aiProcessing}
                className="w-full flex items-center gap-3 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Clock className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-slate-800 text-left">Gap Justification</p>
                  <p className="text-xs text-slate-500 text-left">Get help explaining career gaps.</p>
                </div>
              </button>
              {aiProcessing && (
                <p className="text-sm text-center text-blue-600 animate-pulse">AI is working...</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
