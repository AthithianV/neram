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
import { useTag } from '@/hooks/useTag';
import { ChevronsUpDown, Check } from 'lucide-react';
import {
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
    value: number[];
    onChange: (tags: number[]) => void;
}) => {
    const { data: allTags } = useTag();

    const [openDropdown, setOpenDropdown] = useState(false);
    const [selectedTags, setSelectedTags] = useState<Map<number, Tag>>(
        new Map()
    );
    const { mutate: removeTag } = useRemoveTagFromSession();
    const { mutate: addTag } = useAddTagToSession();

    useEffect(() => {
        if (value && allTags) {
            setSelectedTags(
                new Map(
                    allTags
                        .filter((tag) => value.includes(tag.id))
                        .map((tag) => [tag.id, tag])
                )
            );
        }
    }, [value, allTags]);

    const handleSelectTag = (tag: Tag) => {
        setSelectedTags((prev) => {
            if (prev.has(tag.id)) {
                prev.delete(tag.id);
                if (sessionId) {
                    removeTag({ sessionId, tagId: tag.id });
                }
            } else {
                prev.set(tag.id, tag);
                if (sessionId) {
                    addTag({ sessionId, tagId: tag.id });
                }
            }
            onChange(Array.from(prev.keys()));
            return new Map([...prev]);
        });
    };

    return (
        <div className="flex gap-2">
            <SelectedTags
                selectedTags={Array.from(selectedTags.values())}
                handleRemoveTag={handleSelectTag}
            />
            <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
                <PopoverTrigger asChild>
                    <span className="w-fit bg-white border border-input rounded-md px-3 py-2 shadow-xs flex items-center justify-between cursor-pointer">
                        <ChevronsUpDown className="opacity-50" />
                    </span>
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
                                {allTags?.map((tag) => (
                                    <CommandItem
                                        key={tag.title}
                                        value={tag.title}
                                        onSelect={() => handleSelectTag(tag)}
                                    >
                                        <div
                                            className="p-2 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    tag.color || '#ccc',
                                            }}
                                        ></div>
                                        {tag.title}
                                        {selectedTags.has(tag.id) && (
                                            <Check className="ml-auto" />
                                        )}
                                    </CommandItem>
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
    selectedTags: Tag[];
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

export default TagPicker;
