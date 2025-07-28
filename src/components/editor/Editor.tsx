import { cn } from '@/lib/utils';
import { ListItemNode, ListNode } from '@lexical/list';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode } from '@lexical/rich-text';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ScrollArea } from '../ui/scroll-area';
import EditorToolbar from './EditorToolbar';
import LoadState from './LoadState';

type PropType = {
    className?: string;
    value: string;
    onChange: (text: string) => void;
};

function onError(error: any) {
    console.error(error);
}

const Editor = ({ value, onChange, className }: PropType) => {
    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError,
        nodes: [HeadingNode, ListNode, ListItemNode],
    };

    return (
        <ScrollArea>
            <div className={cn('h-[30vh] w-full rounded', className)}>
                <LexicalComposer initialConfig={initialConfig}>
                    <LoadState content={value} />
                    <EditorToolbar />
                    <RichEditor onChange={onChange} />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <ListPlugin />
                    <CheckListPlugin />
                </LexicalComposer>
            </div>
        </ScrollArea>
    );
};

const RichEditor = ({ onChange }: { onChange: (text: string) => void }) => {
    const [editor] = useLexicalComposerContext();

    const handleChange = () => {
        const content = JSON.stringify(editor.getEditorState());
        onChange(content);
    };
    return (
        <RichTextPlugin
            contentEditable={
                <ContentEditable
                    className="focus:outline-none text-wrap"
                    aria-placeholder={'Enter some text...'}
                    placeholder={<div></div>}
                    onBlur={handleChange}
                />
            }
            ErrorBoundary={LexicalErrorBoundary}
        />
    );
};

const theme = {
    ltr: 'ltr',
    rtl: 'rtl',
    paragraph: 'editor-paragraph text-wrap',
    quote: 'editor-quote',
    heading: {
        h1: 'editor-heading-h1',
        h2: 'editor-heading-h2',
        h3: 'text-xl font-bold',
        h4: 'editor-heading-h4',
        h5: 'editor-heading-h5',
        h6: 'editor-heading-h6',
    },
    list: {
        nested: {
            listitem: 'list-disc',
        },
        ol: 'list-decimal ms-6 pl-2',
        ul: 'list-disc ms-6 pl-2',
        listItem: 'ms-6 pl-2 active:outline-none',
        listitemChecked: 'flex items-center gap-2 text-gray-400 line-through',
        listitemUnchecked: 'flex items-center gap-2',
    },
    hashtag: 'editor-hashtag',
    image: 'editor-image',
    link: 'editor-link',
    text: {
        bold: 'editor-textBold',
        code: 'editor-textCode',
        italic: 'editor-textItalic',
        strikethrough: 'editor-textStrikethrough',
        subscript: 'editor-textSubscript',
        superscript: 'editor-textSuperscript',
        underline: 'editor-textUnderline',
        underlineStrikethrough: 'editor-textUnderlineStrikethrough',
    },
    code: 'editor-code',
    codeHighlight: {
        atrule: 'editor-tokenAttr',
        attr: 'editor-tokenAttr',
        boolean: 'editor-tokenProperty',
        builtin: 'editor-tokenSelector',
        cdata: 'editor-tokenComment',
        char: 'editor-tokenSelector',
        class: 'editor-tokenFunction',
        'class-name': 'editor-tokenFunction',
        comment: 'editor-tokenComment',
        constant: 'editor-tokenProperty',
        deleted: 'editor-tokenProperty',
        doctype: 'editor-tokenComment',
        entity: 'editor-tokenOperator',
        function: 'editor-tokenFunction',
        important: 'editor-tokenVariable',
        inserted: 'editor-tokenSelector',
        keyword: 'editor-tokenAttr',
        namespace: 'editor-tokenVariable',
        number: 'editor-tokenProperty',
        operator: 'editor-tokenOperator',
        prolog: 'editor-tokenComment',
        property: 'editor-tokenProperty',
        punctuation: 'editor-tokenPunctuation',
        regex: 'editor-tokenVariable',
        selector: 'editor-tokenSelector',
        string: 'editor-tokenSelector',
        symbol: 'editor-tokenProperty',
        tag: 'editor-tokenProperty',
        url: 'editor-tokenOperator',
        variable: 'editor-tokenVariable',
    },
};

export default Editor;
