import { TaskItem, TaskList } from '@tiptap/extension-list';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { Suspense, useEffect } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';

const EditorToolbar = React.lazy(() => import('./EditorToolbar'));

const extensions = [TextStyleKit, StarterKit, TaskItem, TaskList];

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
            const html = editor.getHTML().replace(/<p><\/p>/g, '');
            onChange(html);
        },
    });

    useEffect(() => {
        if (editor && editor.isEmpty) {
            editor.commands.setContent(value);
        }
    }, [value]);

    return (
        <div>
            <Suspense fallback={<Skeleton className="w-full h-5" />}>
                <EditorToolbar editor={editor} />
            </Suspense>
            <ScrollArea>
                <EditorContent
                    editor={editor}
                    data-placeholder="Start typing..."
                    className="text-wrap rounded-md border-2"
                    style={{ whiteSpace: 'pre-wrap', userSelect: 'text' }}
                />
            </ScrollArea>
        </div>
    );
};
