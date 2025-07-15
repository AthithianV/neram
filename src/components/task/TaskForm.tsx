import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import TaskSchema, { Task } from '@/schema/TaskSchema';
import { Badge } from '../ui/badge';
import { Plus } from 'lucide-react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Select } from '@radix-ui/react-select';
import {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { Table, TableBody, TableCell, TableRow } from '../ui/table';

const TaskForm = () => {
    const [open, setOpen] = useState(false);
    const form = useForm({
        resolver: zodResolver(TaskSchema),
        defaultValues: {
            status: 'Planning',
            priority: 'Low',
            title: 'Untitled',
        },
    });

    const onSubmit = (data: Task) => {
        console.log('Form Data:', data);
        setOpen(false);
    };

    const closeForm = (state: boolean) => {
        setOpen(state);
        if (state) {
            form.reset();
        }
    };

    return (
        <Dialog open={open} onOpenChange={closeForm}>
            <DialogTrigger asChild>
                <Badge
                    className="py-1 cursor-pointer hover:bg-gray-200"
                    variant={'secondary'}
                    onClick={() => setOpen(true)}
                >
                    <Plus /> Add Task
                </Badge>
            </DialogTrigger>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="min-w-[65%] px-20 py-10"
            >
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* title */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Untitled"
                                            {...field}
                                            className="!text-3xl font-bold border-none shadow-none px-0 !h-auto"
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="border-b-2 pb-4 space-y-1">
                            <Table>
                                <TableBody>
                                    <TableRow className="border-none">
                                        <TableCell className="w-20">
                                            Status
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="status"
                                                render={({ field }) => (
                                                    <FormItem className="flex">
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            defaultValue={
                                                                field.value
                                                            }
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Pick status" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {[
                                                                    'Planning',
                                                                    'Progress',
                                                                    'Review',
                                                                    'Completed',
                                                                ].map((s) => (
                                                                    <SelectItem
                                                                        key={s}
                                                                        value={
                                                                            s
                                                                        }
                                                                    >
                                                                        {s}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>Color</TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="color"
                                                render={({ field }) => (
                                                    <FormItem className="flex">
                                                        <FormControl>
                                                            <Input />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow></TableRow>
                                </TableBody>
                            </Table>
                            {/* status -----*/}
                        </div>

                        {/* description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write more about this task Here..."
                                            rows={4}
                                            {...field}
                                            className="bg-transparent border-none shadow-none px-1 w-full !text-md"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-2 justify-end">
                            <Button
                                variant={'destructive'}
                                onClick={() => closeForm(false)}
                            >
                                Close
                            </Button>
                            <Button type="submit" disabled={false}>
                                {false ? 'Saving…' : 'Save project'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default TaskForm;
