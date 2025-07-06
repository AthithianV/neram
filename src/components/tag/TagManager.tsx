import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import {
    useTag,
    useCreateTag,
    useUpdateTag,
    useDeleteTag,
} from '@/hooks/useTag';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { Tag } from '@/schema/TagSchema';

const TagManager = () => {
    const { data: tags, isLoading } = useTag();
    const createTag = useCreateTag();
    const updateTag = useUpdateTag();
    const deleteTag = useDeleteTag();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        color: '#3b82f6',
        is_default: false,
    });

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            color: '#3b82f6',
            is_default: false,
        });
    };

    const handleCreate = () => {
        if (!formData.title.trim()) return;

        createTag.mutate(
            {
                title: formData.title.trim(),
                description: formData.description || undefined,
                color: formData.color,
                is_default: formData.is_default,
            },
            {
                onSuccess: () => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                },
            },
        );
    };

    const handleEdit = (tag: Tag) => {
        if (!tag.title) return;

        setSelectedTag(tag);
        setFormData({
            title: tag.title,
            description: tag.description || '',
            color: tag.color || '#3b82f6',
            is_default: false,
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = () => {
        if (!selectedTag?.title || !formData.title.trim()) return;

        updateTag.mutate(
            {
                title: formData.title.trim(),
                description: formData.description || undefined,
                color: formData.color,
                is_default: formData.is_default,
            },
            {
                onSuccess: () => {
                    setIsEditDialogOpen(false);
                    resetForm();
                    setSelectedTag(null);
                },
            },
        );
    };

    const handleDelete = (tagTitle: string) => {
        if (
            window.confirm(
                `Are you sure you want to delete the tag "${tagTitle}"?`,
            )
        ) {
            deleteTag.mutate(tagTitle);
        }
    };

    if (isLoading) {
        return <div className="p-4">Loading tags...</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Tag Manager</h2>
                <Dialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Tag
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Tag</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder="Enter tag title"
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Enter tag description"
                                />
                            </div>
                            <div>
                                <Label htmlFor="color">Color</Label>
                                <Input
                                    id="color"
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            color: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_default"
                                    checked={formData.is_default}
                                    onCheckedChange={(checked: boolean) =>
                                        setFormData({
                                            ...formData,
                                            is_default: checked as boolean,
                                        })
                                    }
                                />
                                <Label htmlFor="is_default">Default tag</Label>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsCreateDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreate}
                                    disabled={
                                        !formData.title.trim() ||
                                        createTag.isPending
                                    }
                                >
                                    {createTag.isPending
                                        ? 'Creating...'
                                        : 'Create'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tags?.map((tag: Tag) => (
                    <Card key={tag.title} className="relative">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor:
                                                tag.color || '#ccc',
                                        }}
                                    />
                                    {tag.title || 'Untitled'}
                                    {/* {tag.is_default && ( */}
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        Default
                                    </Badge>
                                    {/* )} */}
                                </CardTitle>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEdit(tag)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Edit2 className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            tag.title && handleDelete(tag.title)
                                        }
                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                {tag.description || 'No description'}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Tag</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                                id="edit-title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                                placeholder="Enter tag title"
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-description">
                                Description
                            </Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Enter tag description"
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-color">Color</Label>
                            <Input
                                id="edit-color"
                                type="color"
                                value={formData.color}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        color: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="edit-is_default"
                                checked={formData.is_default}
                                onCheckedChange={(checked: boolean) =>
                                    setFormData({
                                        ...formData,
                                        is_default: checked as boolean,
                                    })
                                }
                            />
                            <Label htmlFor="edit-is_default">Default tag</Label>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdate}
                                disabled={
                                    !formData.title.trim() ||
                                    updateTag.isPending
                                }
                            >
                                {updateTag.isPending ? 'Updating...' : 'Update'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TagManager;
