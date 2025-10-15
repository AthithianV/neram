import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import Editor from '../editor/Editor';
import ColorPicker from '../form/ColorPicker';
import Title from '../form/Title';

import { TAG_DEFAULT_VALUE } from '@/constants/tag';
import { useCreateTag, useTag, useUpdateTag } from '@/hooks/useTag';
import { CreateTag, CreateTagSchema } from '@/schema/TagSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowBigUpDashIcon, PlusIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

type PropType = {
    setShowForm: (b: boolean) => void;
    selectedTag: CreateTag | null;
};

const TagForm = ({ setShowForm, selectedTag }: PropType) => {
    const { data: tags, isLoading } = useTag();
    const createTag = useCreateTag();
    const updateTag = useUpdateTag();

    const form = useForm<CreateTag>({
        resolver: zodResolver(CreateTagSchema),
        defaultValues: TAG_DEFAULT_VALUE,
    });

    useEffect(() => {
        if (selectedTag) {
            form.reset(selectedTag);
        } else {
            form.reset(TAG_DEFAULT_VALUE);
        }
    }, [selectedTag]);

    const onSubmit = (values: CreateTag) => {
        const tagExists = tags?.find(
            (tag) =>
                !(selectedTag && selectedTag.id === values.id) &&
                tag.title.toLowerCase() === values.title.toLowerCase(),
        );

        if (tagExists) {
            toast.error('Tag Already Exists, Please try different Name.');
            return;
        }

        if (selectedTag) {
            if (selectedTag.id)
                updateTag.mutateAsync({
                    tagId: selectedTag.id,
                    tagToUpdate: values,
                });
        } else {
            createTag.mutateAsync(
                {
                    ...values,
                },
                {
                    onSuccess: () => {
                        form.reset();
                    },
                },
            );
        }
        setShowForm(false);
        form.reset(TAG_DEFAULT_VALUE);
    };

    if (isLoading || !tags) {
        return <Skeleton className="h-40" />;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                                    key={form.watch('title') + '-editor'}
                                    value={field.value ?? ''}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2">
                    {selectedTag ? (
                        <Button
                            type="submit"
                            disabled={updateTag.isPending}
                            className="bg-blue-500 hover:bg-blue-600 font-bold text-white"
                        >
                            <ArrowBigUpDashIcon />
                            {updateTag.isPending ? 'Updating...' : 'Update'}
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={createTag.isPending}
                            className="bg-blue-500 hover:bg-blue-600 font-bold text-white"
                        >
                            <PlusIcon />
                            {createTag.isPending ? 'Adding...' : 'Add'}
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
};

export default TagForm;
