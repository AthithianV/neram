import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAddTagToSession, useRemoveTagFromSession } from '@/hooks/useSession';
import { useTag } from '@/hooks/useTag';
import { Tag } from '@/schema/TagSchema';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

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
    const [selectedTags, setSelectedTags] = useState<Map<number, Tag>>(new Map());
    const { mutate: removeTag } = useRemoveTagFromSession();
    const { mutate: addTag } = useAddTagToSession();

    useEffect(() => {
        if (value && allTags) {
            setSelectedTags(
                new Map(
                    allTags.filter((tag) => value.includes(tag.id)).map((tag) => [tag.id, tag]),
                ),
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
        <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
            <PopoverTrigger>
                <SelectedTags
                    selectedTags={Array.from(selectedTags.values())}
                    handleRemoveTag={handleSelectTag}
                />
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="end" side="top" sideOffset={10}>
                <Command>
                    <CommandInput placeholder="Search Tags..." className="h-9" />
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
                                            backgroundColor: tag.color || '#ccc',
                                        }}
                                    ></div>
                                    {tag.title}
                                    {selectedTags.has(tag.id) && <Check className="ml-auto" />}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

const SelectedTags = ({
    selectedTags,
}: {
    selectedTags: Tag[];
    handleRemoveTag: (tag: Tag) => void;
}) => {
    return (
        <ScrollArea className="bg-white border rounded-md">
            <div className="flex items-center gap-1  p-2 rounded-md flex-1 w-45 !h-8">
                {Array.from(selectedTags).length > 0 ? (
                    Array.from(selectedTags).map((tag) => (
                        <Badge
                            key={tag.title}
                            variant="outline"
                            className="cursor-pointer flex items-center gap-1"
                            style={{
                                backgroundColor: tag.color || '#ccc',
                            }}
                        >
                            {tag.title}
                        </Badge>
                    ))
                ) : (
                    <span className="text-sm text-muted-foreground">Select tags</span>
                )}
            </div>
            <ScrollBar orientation="horizontal" style={{ height: '8px' }} />
        </ScrollArea>
    );
};

export default TagPicker;
