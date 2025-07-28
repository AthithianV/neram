import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

const LoadState = ({ content = '' }: { content: string | null }) => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        try {
            const newState = editor.parseEditorState(content ?? '{}');
            editor.setEditorState(newState);
        } catch (err) {
            console.error('Failed to parse editor state:', err);
        }
    }, [editor, content]);

    return <></>;
};

export default LoadState;
