import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { useTag } from '@/hooks/useTodo';
import { ChevronsUpDown, Check } from 'lucide-react';
import {
    TagType,
    useAddTagToSession,
    useRemoveTagFromSession,
} from '@/hooks/useSession';
import { Tag } from '@/schema/TagSchema';

const TagPicker = ({
    sessionId,
    value,
    onChange,
}: {
    sessionId: number | undefined;
    value: Tag[];
    onChange: (tags: Tag[]) => void;
}) => {
    const { data: allTags } = useTag();

    const [openDropdown, setOpenDropdown] = useState(false);
    const [selectedTags, setSelectedTags] = useState<Set<Tag>>(new Set([]));
    const { mutate: removeTag } = useRemoveTagFromSession();
    const { mutate: addTag } = useAddTagToSession();

    useEffect(() => {
        if (value) {
            setSelectedTags(new Set(value));
        }
    }, [value]);

    const handleSelectTag = (tag: Tag) => {
        setSelectedTags((prev) => {
            if (prev.has(tag)) {
                prev.delete(tag);
                if (sessionId) {
                    removeTag({ sessionId, tagId: tag.id });
                }
            } else {
                prev.add(tag);
                if (sessionId) {
                    addTag({ sessionId, tagId: tag.id });
                }
            }
            return new Set([...prev]);
        });
    };

    useEffect(() => {
        if (!openDropdown) {
            onChange(Array.from(selectedTags));
        }
    }, [openDropdown]);

    return (
        <div className="flex gap-2">
            <SelectedTags
                selectedTags={selectedTags}
                handleRemoveTag={handleSelectTag}
            />
            <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
                <PopoverTrigger asChild>
                    {/* <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={openDropdown}
                    className="w-full justify-between bg-white border-gray-200 shadow-xs h-fit"
                > */}
                    <span className="w-fit bg-white border border-input rounded-md px-3 py-2 shadow-xs flex items-center justify-between cursor-pointer">
                        <ChevronsUpDown className="opacity-50" />
                    </span>

                    {/* </Button> */}
                </PopoverTrigger>
                <PopoverContent
                    className="w-full p-0"
                    align="end"
                    side="top"
                    sideOffset={10}
                >
                    <Command>
                        <CommandInput
                            placeholder="Search framework..."
                            className="h-9"
                        />
                        <CommandList>
                            <CommandEmpty>No Tags found.</CommandEmpty>
                            <CommandGroup>
                                {allTags?.map((tag, index) => (
                                    <TagItem
                                        key={index}
                                        tag={tag}
                                        handleSelectTag={handleSelectTag}
                                        isSelected={selectedTags.has(tag)}
                                    />
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

const SelectedTags = ({
    selectedTags,
    handleRemoveTag,
}: {
    selectedTags: Set<Tag>;
    handleRemoveTag: (tag: Tag) => void;
}) => {
    return (
        <div className="flex flex-wrap items-center gap-2 bg-white border p-2 rounded-md flex-1">
            {Array.from(selectedTags).length > 0 ? (
                Array.from(selectedTags).map((tag) => (
                    <Badge
                        key={tag.title}
                        variant="outline"
                        className="cursor-pointer flex items-center gap-1"
                        style={{
                            backgroundColor: tag.color || '#ccc',
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            handleRemoveTag(tag);
                        }}
                    >
                        {tag.title}
                    </Badge>
                ))
            ) : (
                <span className="text-sm text-muted-foreground">
                    Select tags
                </span>
            )}
        </div>
    );
};

const TagItem = ({
    tag,
    handleSelectTag,
    isSelected,
}: {
    tag: TagType;
    handleSelectTag: (tag: Tag) => void;
    isSelected: boolean;
}) => {
    return (
        <CommandItem
            key={tag.title}
            value={tag.title}
            onSelect={() => handleSelectTag(tag)}
        >
            <div
                className="p-2 rounded-full"
                style={{
                    backgroundColor: tag.color || '#ccc',
                }}
            ></div>
            {tag.title}
            {isSelected && <Check className="ml-auto" />}
        </CommandItem>
    );
};

export default TagPicker;
