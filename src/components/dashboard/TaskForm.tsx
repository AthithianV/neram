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
import {
    DialogFormContent,
    DialogFormTrigger,
} from '@/components/form/DialogFormWrapper';
import { Dialog } from '@/components/ui/dialog';

import { Textarea } from '../ui/textarea';
import TaskSchema, { Task } from '@/schema/TaskSchema';
import { ReactNode } from 'react';

export const TaskFormDialog = ({
    type,
    initialValue,
    children,
}: {
    type: 'EDIT' | 'CREATE';
    initialValue?: Task;
    children: ReactNode;
}) => {
    return (
        <Dialog modal={false}>
            <DialogFormTrigger>{children}</DialogFormTrigger>
            <DialogFormContent
                title={type == 'EDIT' ? 'Edit Task' : 'Create Task'}
                description={
                    type == 'EDIT'
                        ? 'Fill in the details below to edit the task.'
                        : 'Fill in the details to Create new Task'
                }
            >
                <TaskForm defaultValues={initialValue} />
            </DialogFormContent>
        </Dialog>
    );
};

const TaskForm = ({ defaultValues }: { defaultValues?: Task }) => {
    const form = useForm<Task>({
        resolver: zodResolver(TaskSchema),
        defaultValues: defaultValues
            ? defaultValues
            : {
                  id: Date.now(),
                  title: '',
                  description: '',
                  color: '',
              },
    });

    function onSubmit(data: z.infer<typeof TaskSchema>) {
        toast('Task has been Created');
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

export default TaskForm;
