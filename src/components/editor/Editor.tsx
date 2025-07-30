import { BulletList, OrderedList, TaskItem, TaskList } from '@tiptap/extension-list';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import EditorToolbar from './EditorToolbar';

const extensions = [
    TextStyleKit,
    StarterKit,
    BulletList,
    OrderedList,
    TaskItem,
    TaskList,
];

export default ({
    value,
    onChange,
}: {
    value: string;
    onChange: (text: string) => void;
}) => {
    const editor = useEditor({
        extensions,
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
    });

    useEffect(() => {
        editor.commands.setContent(value);
    }, [value]);

    return (
        <div>
            <EditorToolbar editor={editor} />
            <ScrollArea>
                <EditorContent
                    editor={editor}
                    className="text-wrap border-none rounded-md border-2 focus:outline-none"
                />
            </ScrollArea>
        </div>
    );
};
