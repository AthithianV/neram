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
import { useCreateTag, useTag } from '@/hooks/useTag';
import TagSchema, { Tag } from '@/schema/TagSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

type PropType = {
    setShowForm: (b: boolean) => void;
};

const TagForm = ({ setShowForm }: PropType) => {
    const { data: tags, isLoading } = useTag();
    const createTag = useCreateTag();

    const form = useForm<Tag>({
        resolver: zodResolver(TagSchema),
        defaultValues: TAG_DEFAULT_VALUE,
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
                                <Title onChange={field.onChange} value={field.value} />
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
                    <Button type="submit" disabled={createTag.isPending}>
                        {createTag.isPending ? 'Adding...' : 'Add Tag'}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default TagForm;
