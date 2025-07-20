import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Bold,
    Heading1,
    Heading2,
    Heading3,
    Italic,
    List,
    ListOrdered,
    Strikethrough,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Toggle } from '../ui/toggle';

type Props = {
    value?: string;
    onChange: (value: string) => void;
};

const RichEditor = ({ value, onChange }: Props) => {
    const [active, setActive] = useState(false);
    const toolbarRef = useRef<HTMLDivElement | null>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc ml-3',
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal ml-3',
                    },
                },
            }),
        ],
        content: value ?? 'More...',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'min-h-[150px] focus:outline-none text-base leading-relaxed p-2 prose max-w-none',
            },
            handleDOMEvents: {
                focus: () => {
                    setActive(true);
                    return false;
                },
                blur: () => {
                    setTimeout(() => {
                        const activeEl = document.activeElement;
                        if (
                            !editor?.isFocused &&
                            toolbarRef.current &&
                            !toolbarRef.current.contains(activeEl)
                        ) {
                            setActive(false);
                        }
                    }, 0);
                    return false;
                },
            },
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value ?? '');
        }
    }, [value]);

    return (
        <>
            <AnimatePresence>
                {active && <MenuBar editor={editor} toolbarRef={toolbarRef} />}
            </AnimatePresence>
            <EditorContent editor={editor} />
        </>
    );
};

const MenuBar = ({
    editor,
    toolbarRef,
}: {
    editor: Editor | null;
    toolbarRef: React.RefObject<HTMLDivElement>;
}) => {
    if (!editor) {
        return null;
    }

    const Options = [
        {
            icon: <Heading1 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            pressed: editor.isActive('heading', { level: 1 }),
        },
        {
            icon: <Heading2 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            pressed: editor.isActive('heading', { level: 2 }),
        },
        {
            icon: <Heading3 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            pressed: editor.isActive('heading', { level: 3 }),
        },
        {
            icon: <Bold className="size-4" />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            pressed: editor.isActive('bold'),
        },
        {
            icon: <Italic className="size-4" />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            pressed: editor.isActive('italic'),
        },
        {
            icon: <Strikethrough className="size-4" />,
            onClick: () => editor.chain().focus().toggleStrike().run(),
            pressed: editor.isActive('strike'),
        },
        {
            icon: <List className="size-4" />,
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            pressed: editor.isActive('bulletList'),
        },
        {
            icon: <ListOrdered className="size-4" />,
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            pressed: editor.isActive('orderedList'),
        },
    ];

    const backdropVariants = {
        hidden: { opacity: 0, scale: 0.95, height: 0 },
        visible: { opacity: 1, scale: 1, height: 'auto' },
    };

    return (
        <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border rounded-md p-0 mb-1 bg-slate-50 space-x-2 z-50"
            ref={toolbarRef}
        >
            {Options.map((option, index) => (
                <Toggle
                    className={'overflow-hidden'}
                    key={index}
                    pressed={option.pressed}
                    onPressedChange={option.onClick}
                >
                    {option.icon}
                </Toggle>
            ))}
        </motion.div>
    );
};
export default RichEditor;
