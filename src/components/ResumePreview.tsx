import { useEffect } from 'react';
import { FormattingSettings } from '../types/resume';

interface ResumePreviewProps {
  content: string;
  formatting: FormattingSettings;
  onContentChange: (content: string) => void;
  editorRef: React.RefObject<HTMLDivElement>;
  onReorderSections: (newOrder: Array<{ id: string; name: string }>) => void;
}

export function ResumePreview({
  content,
  formatting,
  onContentChange,
  editorRef,
  onReorderSections
}: ResumePreviewProps) {

  const pageStyle: React.CSSProperties = {
    fontFamily: formatting.fontStyle,
    fontSize: `${formatting.fontSize}pt`,
    lineHeight: formatting.lineSpacing.toString(),
    padding: `${formatting.topBottomMargin}mm ${formatting.sideMargins}mm`,
    color: formatting.textColor,
  };


  useEffect(() => {
    const editorNode = editorRef.current;
    if (!editorNode) return;

    let draggedElement: HTMLElement | null = null;

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      draggedElement = target.closest('.resume-section');

      if (draggedElement) {
        draggedElement.classList.add('dragging');
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/html', draggedElement.innerHTML);
        }
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (!draggedElement) return;

      const target = (e.target as HTMLElement).closest('.resume-section') as HTMLElement;
      if (!target || target === draggedElement) return;

      const rect = target.getBoundingClientRect();
      const isAfter = e.clientY > rect.top + rect.height / 2;

      editorNode.querySelectorAll('.drag-over-indicator').forEach(el => el.remove());

      const placeholder = document.createElement('div');
      placeholder.className = 'drag-over-indicator';

      const sectionName = draggedElement?.dataset.sectionName;
      placeholder.textContent = sectionName ? `${sectionName} will be placed here` : 'Drop here';

      if (isAfter) {
        target.parentNode?.insertBefore(placeholder, target.nextSibling);
      } else {
        target.parentNode?.insertBefore(placeholder, target);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const placeholder = editorNode.querySelector('.drag-over-indicator');
      if (draggedElement && placeholder) {
        placeholder.parentNode?.insertBefore(draggedElement, placeholder);
        onContentChange(editorNode.innerHTML);

        const newOrder: Array<{ id: string; name: string }> = [];
        editorNode.querySelectorAll('.resume-section').forEach((section) => {
          const sectionId = section.getAttribute('data-section-id');
          const sectionName = section.getAttribute('data-section-name');
          if (sectionId && sectionName) {
            newOrder.push({ id: sectionId, name: sectionName });
          }
        });
        onReorderSections(newOrder);
      }
      placeholder?.remove();
      draggedElement?.classList.remove('dragging');
      draggedElement = null;
    };

    const handleDragEnd = () => {
      draggedElement?.classList.remove('dragging');
      editorNode.querySelectorAll('.drag-over-indicator').forEach(el => el.remove());
      draggedElement = null;
    };

    const sections = editorNode.querySelectorAll('.resume-section');
    sections.forEach(section => section.setAttribute('draggable', 'true'));

    editorNode.addEventListener('dragstart', handleDragStart);
    editorNode.addEventListener('dragover', handleDragOver);
    editorNode.addEventListener('drop', handleDrop);
    editorNode.addEventListener('dragend', handleDragEnd);

    return () => {
      editorNode.removeEventListener('dragstart', handleDragStart);
      editorNode.removeEventListener('dragover', handleDragOver);
      editorNode.removeEventListener('drop', handleDrop);
      editorNode.removeEventListener('dragend', handleDragEnd);
    };
  }, [content, onContentChange, editorRef, onReorderSections]);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content, editorRef]);

  return (
    <div className="w-full bg-transparent p-8">
      <div
        ref={editorRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onInput={(e) => onContentChange(e.currentTarget.innerHTML)}
        className="w-[210mm] min-h-[297mm] bg-white shadow-2xl mx-auto resume-content-view focus:outline-none focus:ring-2 focus:ring-blue-400"
        style={pageStyle}
      />
    </div>
  );
}
