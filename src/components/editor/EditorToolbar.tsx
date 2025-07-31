import { useEditorState, type Editor } from '@tiptap/react';
import {
    Bold,
    Code,
    CodeSquare,
    Eraser,
    Hash,
    Italic,
    List,
    ListOrdered,
    Quote,
    Redo,
    Ruler,
    Square,
    Strikethrough,
    Undo,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const EditorToolbar = ({ editor }: { editor: Editor }) => {
    const editorState = useEditorState({
        editor,
        selector: (ctx) => {
            return {
                isBold: ctx.editor.isActive('bold') ?? false,
                canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
                isItalic: ctx.editor.isActive('italic') ?? false,
                canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
                isStrike: ctx.editor.isActive('strike') ?? false,
                canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
                isCode: ctx.editor.isActive('code') ?? false,
                canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
                canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
                isParagraph: ctx.editor.isActive('paragraph') ?? false,
                isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
                isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
                isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
                isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
                isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
                isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,
                isBulletList: ctx.editor.isActive('bulletList') ?? false,
                isOrderedList: ctx.editor.isActive('orderedList') ?? false,
                isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
                isBlockquote: ctx.editor.isActive('blockquote') ?? false,
                canUndo: ctx.editor.can().chain().undo().run() ?? false,
                canRedo: ctx.editor.can().chain().redo().run() ?? false,
            };
        },
    });

    const tools = [
        {
            title: 'Undo',
            icon: <Undo />,
            onClick: () => editor.chain().focus().undo().run(),
            disabled: !editorState.canUndo,
        },
        {
            title: 'Redo',
            icon: <Redo />,
            onClick: () => editor.chain().focus().redo().run(),
            disabled: !editorState.canRedo,
        },
        {
            break: true,
        },
        {
            title: 'Bold',
            icon: <Bold />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            disabled: !editorState.canBold,
            className: editorState.isBold ? 'bg-gray-200' : '',
        },
        {
            title: 'Italic',
            icon: <Italic />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            disabled: !editorState.canItalic,
            className: editorState.isItalic ? 'bg-gray-200' : '',
        },
        {
            title: 'Strick Through',
            icon: <Strikethrough />,
            onClick: () => editor.chain().focus().toggleStrike().run(),
            disabled: !editorState.canStrike,
            className: editorState.isStrike ? 'bg-gray-200' : '',
        },
        {
            title: 'Code',
            icon: <Code />,
            onClick: () => editor.chain().focus().toggleCode().run(),
            disabled: !editorState.canCode,
            className: editorState.isCode ? 'bg-gray-200' : '',
        },

        {
            break: true,
        },
        {
            title: 'Heading',
            icon: <Hash />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            disabled: !editorState.canCode,
            className: editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : '',
        },
        {
            title: 'Number List',
            icon: <ListOrdered />,
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            className: editor.isActive('orderedList') ? 'bg-gray-200' : '',
        },
        {
            title: 'Bullet List',
            icon: <List />,
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            className: editor.isActive('bulletList') ? 'bg-gray-200' : '',
        },
        {
            title: 'Check List',
            icon: <Square />,
            onClick: () => editor.chain().focus().toggleTaskList().run(),
            className: editor.isActive('taskList') ? 'bg-gray-200' : '',
        },
        {
            title: 'Code Block',
            icon: <CodeSquare />,
            onClick: () => editor.chain().focus().toggleCodeBlock().run(),
            className: editorState.isCodeBlock ? 'bg-gray-200' : '',
        },
        {
            title: 'Block Quote',
            icon: <Quote />,
            onClick: () => editor.chain().focus().toggleBlockquote().run(),
            className: editorState.isBlockquote ? 'bg-gray-200' : '',
        },

        {
            break: true,
        },
        {
            title: 'Horizontal rule',
            icon: <Ruler />,
            onClick: () => editor.chain().focus().setHorizontalRule().run(),
        },

        {
            title: 'Clear Nodes',
            icon: <Eraser />,
            onClick: () => editor.chain().focus().clearNodes().run(),
        },
    ];

    return (
        <ul className="space-y-2 mb-2 border-2 rounded-md w-fit flex">
            {tools.map((tool, index) => (
                <li key={index} className="mb-0">
                    {tool.break ? (
                        <Separator orientation="vertical" />
                    ) : (
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                                <Button
                                    disabled={tool.disabled}
                                    size={'icon'}
                                    variant="ghost"
                                    type="button"
                                    className={cn('rounded-xs', tool.className)}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        tool.onClick && tool.onClick();
                                    }}
                                >
                                    {tool.icon}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{tool.title}</TooltipContent>
                        </Tooltip>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default EditorToolbar;
