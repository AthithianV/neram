import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { useTag } from '@/hooks/useTag';
import { Tag } from '@/schema/TagSchema';
import { Plus, TagIcon } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import TagForm from './TagForm';

const TagModal = () => {
    const { data: tags, isLoading } = useTag();

    const [showForm, setShowForm] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

    const openForm = (tag: Tag | null) => {
        setShowForm(true);
        setSelectedTag(tag);
    };

    return (
        <Dialog>
            <DialogTrigger className="text-sm font-semibold rounded-sm flex gap-1 items-center cursor-pointer p-2 hover:bg-gray-50">
                <TagIcon size={15} />
                Tags
            </DialogTrigger>
            <DialogContent className="min-h-[60vh] min-w-[50vw]">
                <DialogHeader>
                    <DialogTitle className="flex gap-2 border-b-1 pb-2">
                        <TagIcon /> Tags
                    </DialogTitle>
                    <DialogDescription />
                    <div className="flex gap-4 flex-col">
                        {/* Tag List */}
                        <div className="flex flex-1 flex-col gap-2">
                            {isLoading ? (
                                <p className="text-sm text-gray-500">Loading...</p>
                            ) : (
                                <ul className="flex gap-1 pb-2 items-center">
                                    {tags?.map((tag) => (
                                        <li
                                            key={tag.title}
                                            onClick={() => openForm(tag)}
                                            className="cursor-pointer"
                                        >
                                            <Badge
                                                style={{
                                                    backgroundColor: tag.color,
                                                }}
                                                className="text-sm px-2 rounded-[0.3rem]"
                                            >
                                                {tag.title}
                                            </Badge>
                                        </li>
                                    ))}
                                    <li
                                        onClick={() => {
                                            openForm(null);
                                        }}
                                    >
                                        <Button variant={'ghost'} className="h-8">
                                            <Plus />
                                        </Button>
                                    </li>
                                </ul>
                            )}
                        </div>

                        {/* Add Tag Form */}
                        {showForm && (
                            <TagForm
                                selectedTag={selectedTag}
                                setShowForm={setShowForm}
                            />
                        )}
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default TagModal;
