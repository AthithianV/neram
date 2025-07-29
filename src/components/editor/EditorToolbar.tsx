import {
    $isListNode,
    INSERT_CHECK_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import {
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
    COMMAND_PRIORITY_LOW,
    FORMAT_TEXT_COMMAND,
    KEY_BACKSPACE_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
} from 'lexical';

import { Bold, Hash, Italic, List, ListOrdered, Redo, Square, Undo } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const EditorToolbar = () => {
    const [editor] = useLexicalComposerContext();

    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
        }
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(
                ({ editorState, dirtyElements, dirtyLeaves }) => {
                    editorState.read(() => {
                        $updateToolbar();
                    });
                    if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
                        return;
                    }
                },
            ),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, _newEditor) => {
                    $updateToolbar();
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                KEY_BACKSPACE_COMMAND,
                () => {
                    let handled = false;

                    editor.update(() => {
                        const selection = $getSelection();
                        if (!$isRangeSelection(selection) || !selection.isCollapsed())
                            return;

                        const anchor = selection.anchor.getNode();
                        const parent = anchor.getParent();

                        const isAtStart = selection.anchor.offset === 0;
                        const isEmpty = anchor.getTextContent() === '';
                        const isInsideList = parent && $isListNode(parent);

                        if (isAtStart && isEmpty && isInsideList) {
                            const paragraph = $createParagraphNode();
                            paragraph.select();
                            handled = true;
                        }
                    });

                    return handled;
                },
                COMMAND_PRIORITY_CRITICAL,
            ),
        );
    }, [editor, $updateToolbar]);

    const handleHeading = () => {
        editor.update(() => {
            editor.focus();
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode('h3'));
            }
        });
    };

    const handleList = (type: 'ORDERED_LIST' | 'UNORDERED_LIST' | 'CHECK_LIST') => {
        editor.focus();
        editor.update(() => {
            const selection = $getSelection();

            if (!$isRangeSelection(selection)) return;

            const nodes = selection.getNodes();
            const isInsideList = nodes.some((node) => {
                const parent = node.getParent();
                return parent && $isListNode(parent);
            });

            if (isInsideList) {
                editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            } else {
                switch (type) {
                    case 'ORDERED_LIST':
                        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
                        break;
                    case 'UNORDERED_LIST':
                        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
                        break;
                    case 'CHECK_LIST':
                        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
                        break;
                }
            }
        });
    };

    const tools = [
        {
            title: 'Undo',
            icon: <Undo />,
            handleClick: () => editor.dispatchCommand(UNDO_COMMAND, undefined),
            disabled: !canUndo,
        },
        {
            title: 'Redo',
            icon: <Redo />,
            handleClick: () => editor.dispatchCommand(REDO_COMMAND, undefined),
            disabled: !canRedo,
        },
        {
            title: 'Bold',
            icon: <Bold />,
            handleClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold'),
            className: isBold ? 'bg-gray-100' : '',
        },
        {
            title: 'Italic',
            icon: <Italic />,
            handleClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic'),
            className: isItalic ? 'bg-gray-100' : '',
        },
        {
            title: 'Heading',
            icon: <Hash />,
            handleClick: handleHeading,
        },
        {
            title: 'Bullet List',
            icon: <List />,
            handleClick: () => handleList('UNORDERED_LIST'),
        },
        {
            title: 'Numbered List',
            icon: <ListOrdered />,
            handleClick: () => handleList('ORDERED_LIST'),
        },
        {
            title: 'Todo List',
            icon: <Square />,
            handleClick: () => handleList('CHECK_LIST'),
        },
    ];

    return (
        <ul className="space-y-2 mb-2 border-2 rounded-md w-fit flex" ref={toolbarRef}>
            {tools.map(({ title, icon, handleClick, className, disabled }, index) => (
                <li key={index} className="mb-0">
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
                            <Button
                                disabled={disabled}
                                size={'icon'}
                                variant="ghost"
                                type="button"
                                className={cn('rounded-xs', className)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleClick();
                                }}
                            >
                                {icon}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{title}</TooltipContent>
                    </Tooltip>
                </li>
            ))}
        </ul>
    );
};

export default EditorToolbar;
