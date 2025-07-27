import { cn } from '@/lib/utils';
import { Bold, CheckSquare, Hash, Italic, List, ListOrdered } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';

type PropType = { value: string; onChange: (text: string) => void };

const RichEditor = ({ value, onChange }: PropType) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [selection, setSelection] = useState(null);
    const isComposing = useRef(false);

    const [text, setText] = useState('');

    useEffect(() => {
        if (value) {
            setText(value);
        }
    }, [value]);

    useEffect(() => {
        if (editorRef.current && value && editorRef.current.innerHTML === '') {
            editorRef.current.innerHTML = text;
        }
    }, []);

    const handleInput = () => {
        if (editorRef.current && onChange && !isComposing.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleCompositionStart = () => {
        isComposing.current = true;
    };

    const handleCompositionEnd = () => {
        isComposing.current = false;
        handleInput();
    };

    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
            setSelection(sel.getRangeAt(0).cloneRange());
        }
    };

    const restoreSelection = () => {
        if (selection && editorRef.current) {
            try {
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(selection);
            } catch (e) {
                // Selection restoration failed, focus at end
                editorRef.current.focus();
            }
        }
    };

    const execCommand = (command, value = null) => {
        editorRef.current?.focus();
        restoreSelection();
        document.execCommand(command, false, value);
        saveSelection();
        handleInput();
    };

    const insertHeading = () => {
        editorRef.current?.focus();
        restoreSelection();
        const heading = `<h class="text-xl" font-bold my-2">Heading</h>`;
        document.execCommand('insertHTML', false, heading);
        saveSelection();
        handleInput();
    };

    const insertList = (type) => {
        editorRef.current?.focus();
        restoreSelection();
        if (type === 'ul') {
            const list =
                '<ul class="list-disc list-inside my-2"><li>List item 1</li></ul>';
            document.execCommand('insertHTML', false, list);
        } else if (type === 'ol') {
            const list =
                '<ol class="list-decimal list-inside my-2"><li>List item 1</li></ol>';
            document.execCommand('insertHTML', false, list);
        }
        saveSelection();
        handleInput();
    };

    const insertTodoList = () => {
        editorRef.current?.focus();
        restoreSelection();
        const todoHtml = `
          <div class="my-2">
            <div class="flex items-center mb-1">
              <input type="checkbox" class="mr-2 h-4 w-4 text-blue-600 rounded" />
              <span>Todo item 1</span>
            </div>
          </div>
        `;
        document.execCommand('insertHTML', false, todoHtml);
        saveSelection();
        handleInput();
    };

    const toolbar = [
        {
            icon: Bold,
            action: () => execCommand('bold'),
            title: 'Bold',
        },
        {
            icon: Italic,
            action: () => execCommand('italic'),
            title: 'Italic',
        },
        {
            icon: Hash,
            action: () => insertHeading(),
            title: 'Heading',
        },
        {
            icon: List,
            action: () => insertList('ul'),
            title: 'Bullet List',
        },
        {
            icon: ListOrdered,
            action: () => insertList('ol'),
            title: 'Numbered List',
        },
        {
            icon: CheckSquare,
            action: insertTodoList,
            title: 'Todo List',
        },
    ];

    return (
        <div className="w-full max-w-[50vw] mx-auto">
            <div className="flex flex-wrap gap-2">
                {toolbar.map((tool, index) => (
                    <button
                        type="button"
                        key={index}
                        onClick={tool.action}
                        onMouseDown={(e) => e.preventDefault()}
                        className={cn(
                            'p-2 rounded hover:bg-gray-100 ',
                            'transition-colors duration-200',
                            'flex items-center justify-center',
                        )}
                        title={tool.title}
                    >
                        <tool.icon size={18} className="text-gray-600" />
                    </button>
                ))}
            </div>

            {/* Editor */}
            <ScrollArea>
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning={true}
                    onInput={handleInput}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
                    onMouseUp={saveSelection}
                    onKeyUp={saveSelection}
                    onFocus={saveSelection}
                    className="h-[25vh] p-4 outline-none focus:ring-0"
                    style={{
                        lineHeight: '1.6',
                    }}
                />
            </ScrollArea>
        </div>
    );
};

export default RichEditor;
