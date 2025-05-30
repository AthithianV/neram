import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Textarea } from '../ui/textarea';
import TagSchema, { Tag } from '@/schema/TagSchema';
import { DialogFormTrigger } from '../form/DialogFormWrapper';
import { DialogFormContent } from '../form/DialogFormWrapper';
import { Dialog } from '../ui/dialog';
import { ReactNode } from 'react';

export const TagFormDialog = ({
    type,
    initialValue,
    children,
}: {
    type: 'EDIT' | 'CREATE';
    initialValue?: Tag;
    children: ReactNode;
}) => {
    return (
        <Dialog>
            <DialogFormTrigger>{children}</DialogFormTrigger>
            <DialogFormContent
                title={type == 'EDIT' ? 'Edit Tag' : 'Create Tag'}
                description={
                    type == 'EDIT'
                        ? 'Fill in the details below to edit the tag.'
                        : 'Fill in the details to Create new Tag'
                }
            >
                <TagForm defaultValues={initialValue} />
            </DialogFormContent>
        </Dialog>
    );
};

const TagForm = ({ defaultValues }: { defaultValues?: Tag }) => {
    const form = useForm<Tag>({
        resolver: zodResolver(TagSchema),
        defaultValues: defaultValues || {
            id: Date.now(),
            title: '',
            description: '',
            color: '',
        },
    });

    function onSubmit(data: z.infer<typeof TagSchema>) {
        toast('Tag has been Created');
        console.log(data);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
            >
                {/* title */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                {/* description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                {/* color */}
                <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <div className="flex justify-center">
                    <Button type="submit" className="cursor-pointer">
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default TagForm;
