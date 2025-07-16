import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import TaskSchema, { Task } from '@/schema/TaskSchema';
import { Badge } from '../ui/badge';
import {
    CalendarCheck,
    CalendarMinus,
    CalendarPlus,
    Clock3,
    Flag,
    Gauge,
    Palette,
    Plus,
} from 'lucide-react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
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
import { COLORS } from '@/constants/colors';
import { cn } from '@/lib/utils';
import DatePicker from '../form/DatePicker';
import { TASK_STATUS, TASK_STATUS_COLOR } from '@/constants/project';

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
                className="min-w-[50%] px-20 py-10"
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

                        <TaskForm.TABLE form={form} />

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
                                            className="bg-transparent border-none shadow-none px-1 w-full !text-md max-h-[30vh] overflow-y-auto"
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

TaskForm.TABLE = ({ form }: { form: any }) => {
    return (
        <div className="border-b-2 pb-4 space-y-4">
            <div className="flex flex-wrap gap-4">
                {/* Status */}
                <div className="flex gap-5 w-[45%] items-center">
                    <label className="flex items-center gap-1 text-sm font-medium">
                        <Gauge size={16} /> Status
                    </label>
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger
                                            className="shadow-none border-none p-2 !h-6 rounded text-gray-900 font-semibold"
                                            style={
                                                field.value
                                                    ? {
                                                          backgroundColor:
                                                              TASK_STATUS_COLOR[
                                                                  field.value as
                                                                      | 'Planning'
                                                                      | 'Review'
                                                                      | 'In Progress'
                                                                      | 'Completed'
                                                              ],
                                                      }
                                                    : {}
                                            }
                                        >
                                            <SelectValue
                                                placeholder="Pick status"
                                                className="text-black"
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {TASK_STATUS.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {s}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Color */}
                <div className="flex gap-5 w-[45%] items-center">
                    <label className="flex items-center gap-1 text-sm font-medium">
                        <Palette size={16} /> Color
                    </label>
                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pick color" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {COLORS.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                <span
                                                    className="w-4 h-4 rounded-full inline-block"
                                                    style={{
                                                        backgroundColor: s,
                                                    }}
                                                ></span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Priority */}
                <div className="flex gap-5 w-[45%] items-center">
                    <label className="flex items-center gap-1 text-sm font-medium">
                        <Flag size={16} /> Priority
                    </label>
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pick priority" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {[
                                            'Low',
                                            'Medium',
                                            'High',
                                            'Critical',
                                        ].map((p) => (
                                            <SelectItem key={p} value={p}>
                                                {p}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Deadline */}
                <div className="flex gap-5 w-[45%] items-center">
                    <label className="flex items-center gap-1 text-sm font-medium">
                        <CalendarCheck size={16} /> Deadline
                    </label>
                    <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <DatePicker
                                        date={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Started At */}
                <div className="flex gap-5 w-[45%] items-center">
                    <label className="flex items-center gap-1 text-sm font-medium">
                        <CalendarPlus size={16} /> Started At
                    </label>
                    <FormField
                        control={form.control}
                        name="started_at"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <DatePicker
                                        date={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Completed At */}
                <div className="flex gap-5 w-[45%] items-center">
                    <label className="flex items-center gap-1 text-sm font-medium">
                        <CalendarMinus size={16} /> Completed At
                    </label>
                    <FormField
                        control={form.control}
                        name="completed_at"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <DatePicker
                                        date={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Estimated Time */}
                <div className="flex gap-5 w-[45%] items-center">
                    <label className="flex items-center gap-1 text-sm font-medium">
                        <Clock3 size={16} /> Estimated Time
                    </label>
                    <FormField
                        control={form.control}
                        name="estimated_time"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default TaskForm;
