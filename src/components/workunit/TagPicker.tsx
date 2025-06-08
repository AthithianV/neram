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
import { X, ChevronsUpDown, Check } from 'lucide-react';
import { TagType } from '@/hooks/useWorkunit';
import { Tag } from '@/schema/TagSchema';
import { Button } from '../ui/button';

const TagPicker = ({
    value,
    onChange,
}: {
    value: TagType[] | Tag[];
    onChange: (tags: Tag[]) => void;
}) => {
    const { data: allTags } = useTag();

    const [selectedTags, setSelectedTags] = useState<Set<Tag>>(new Set(value));

    const handleSelectTag = (tag: Tag) => {
        setSelectedTags((prev) => {
            if (prev.has(tag)) {
                prev.delete(tag);
            } else {
                prev.add(tag);
            }
            return new Set([...prev]);
        });
    };

    useEffect(() => {
        onChange(Array.from(selectedTags));
    }, [selectedTags]);

    return (
        <div className="relative">
            <InputWrapper
                selectedTags={selectedTags}
                handleSelectTag={handleSelectTag}
            >
                <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
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
            </InputWrapper>
        </div>
    );
};

const InputWrapper = ({
    children,
    selectedTags,
    handleSelectTag,
}: {
    children: React.ReactNode;
    selectedTags: Set<Tag>;
    handleSelectTag: (tag: Tag) => void;
}) => {
    const [openDropdown, setOpenDropdown] = useState(false);

    return (
        <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={openDropdown}
                    className="w-full justify-between bg-white border-gray-200 shadow-xs h-fit"
                >
                    <SelectedTags
                        selectedTags={selectedTags}
                        handleRemoveTag={handleSelectTag}
                    />
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-full p-0"
                align="start"
                side="top"
                sideOffset={10}
            >
                <Command>
                    <CommandInput
                        placeholder="Search framework..."
                        className="h-9"
                    />
                    {children}
                </Command>
            </PopoverContent>
        </Popover>
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
        <div className="flex flex-wrap items-center gap-2">
            {Array.from(selectedTags).map((tag) => (
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
            ))}
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
