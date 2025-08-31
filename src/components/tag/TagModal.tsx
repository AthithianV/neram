import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useCreateTag, useDeleteTag, useTag } from '@/hooks/useTag';
import TagSchema, { Tag } from '@/schema/TagSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, TagIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '../editor/Editor';
import ColorPicker from '../form/ColorPicker';
import Title from '../form/Title';

const TagModal = () => {
    const { data: tags, isLoading } = useTag();
    const createTag = useCreateTag();
    const deleteTag = useDeleteTag();

    const [showForm, setShowForm] = useState(false);

    const form = useForm<Tag>({
        resolver: zodResolver(TagSchema),
        defaultValues: {
            title: 'Untitled',
            description: '',
            color: '#000000',
        },
    });

    const onSubmit = (values: Tag) => {
        createTag.mutate(
            {
                ...values,
                is_default: false,
            },
            {
                onSuccess: () => {
                    form.reset();
                },
            },
        );
    };

    return (
        <Dialog>
            <DialogTrigger className="text-sm font-semibold rounded-sm flex gap-1 items-center cursor-pointer p-2 hover:bg-gray-50">
                <TagIcon size={15} />
                Tags
            </DialogTrigger>
            <DialogContent className="min-w-[80vw] min-h-[60vh]">
                <DialogHeader>
                    <DialogTitle className="flex gap-2 border-b-1 pb-2">
                        <TagIcon /> Tags
                    </DialogTitle>
                    <DialogDescription />
                    <div className="flex gap-4">
                        {/* Tag List */}
                        <div className="flex flex-1 flex-col gap-2">
                            {isLoading ? (
                                <p className="text-sm text-gray-500">Loading...</p>
                            ) : (
                                <ul className="flex flex-col gap-1 pb-2">
                                    {tags?.map((tag) => (
                                        <li
                                            key={tag.title}
                                            className="flex items-center justify-between p-2 border rounded"
                                            style={{
                                                borderLeft: `4px solid ${tag.color}`,
                                            }}
                                        >
                                            <span>
                                                <span className="font-medium">
                                                    {tag.title}
                                                </span>
                                                {tag.description && (
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        {tag.description}
                                                    </span>
                                                )}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    deleteTag.mutate(tag.title)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </li>
                                    ))}
                                    <li onClick={() => setShowForm(true)}>
                                        <Button variant={'ghost'}>
                                            <Plus />
                                        </Button>
                                    </li>
                                </ul>
                            )}
                        </div>

                        {/* Add Tag Form */}
                        {showForm && (
                            <div className="flex flex-col gap-2 p-2">
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-3"
                                    >
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem className="border-b-1 pb-2">
                                                    <FormControl>
                                                        <Title
                                                            onChange={field.onChange}
                                                            value={field.value}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="color"
                                            render={({ field }) => (
                                                <FormItem className="flex gap-2">
                                                    <FormLabel>Color</FormLabel>
                                                    <FormControl>
                                                        <ColorPicker {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Editor
                                                            value={field.value ?? ''}
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex justify-end gap-2">
                                            <Button
                                                type="submit"
                                                disabled={createTag.isPending}
                                            >
                                                {createTag.isPending
                                                    ? 'Adding...'
                                                    : 'Add Tag'}
                                            </Button>
                                            <Button
                                                variant={'destructive'}
                                                onClick={() => setShowForm(false)}
                                            >
                                                Close
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        )}
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default TagModal;
