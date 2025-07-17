'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ProjectSchema, { Project } from '@/schema/ProjectSchema';

import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';

import { Calendar } from '@/components/ui/calendar';
import dayjs from 'dayjs';

import { COLORS } from '@/constants/colors';
import { TASK_STATUS, TASK_STATUS_COLOR } from '@/constants/project';
import { cn } from '@/lib/utils';

import {
    CalendarCheck,
    CalendarClock,
    CalendarMinus,
    CalendarPlus,
    Flag,
    Gauge,
    Palette,
    Plus,
} from 'lucide-react';
import { toDBTime } from '@/lib/time';

const ProjectForm = () => {
    const [open, setOpen] = useState(false);

    const form = useForm<Project>({
        resolver: zodResolver(ProjectSchema),
        defaultValues: {
            title: '',
            status: '',
            tags: [],
        },
    });

    const onSubmit = (data: Project) => {
        console.log('Project Data:', data);
        setOpen(false);
    };

    const closeForm = (state: boolean) => {
        setOpen(state);
        if (state === false) form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={closeForm} modal={false}>
            <DialogTrigger asChild>
                <Button className="mb-3 cursor-pointer" variant={'outline'}>
                    <Plus className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="bg-gray-800/30 shadow-none border-none rounded-none h-screen flex justify-center items-center min-w-screen"
            >
                <div className="bg-white px-20 py-10 rounded-lg shadow-2xl h-[60vh] max-h-[75vh] w-[60%]">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {/* Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="Project Title..."
                                                {...field}
                                                className="border-none shadow-none px-0 !text-2xl font-semibold"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <ProjectForm.TABLE form={form} />

                            {/* Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Description"
                                                rows={4}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => closeForm(false)}
                                >
                                    Close
                                </Button>
                                <Button type="submit">Save Project</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

ProjectForm.TABLE = ({ form }: { form: any }) => {
    return (
        <div className="space-y-4 border-b-2 pb-4">
            <div className="flex flex-wrap gap-4">
                {/* Status */}
                <div className="flex w-[45%] items-center gap-5">
                    <label className="flex w-[40%] items-center gap-1 text-sm font-medium">
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
                                        <SelectTrigger className="p-2 !h-6 rounded text-white bg-yellow-500 font-semibold shadow-none border-none">
                                            <SelectValue placeholder="Pick status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {TASK_STATUS.map((status) => (
                                            <SelectItem
                                                key={status}
                                                value={status}
                                            >
                                                {status}
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
                <div className="flex w-[45%] items-center gap-5">
                    <label className="flex w-[40%] items-center gap-1 text-sm font-medium">
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
                                        <SelectTrigger
                                            className="p-2 !h-6 rounded font-semibold shadow-none border-none text-white"
                                            style={{
                                                backgroundColor: field.value,
                                            }}
                                        >
                                            <SelectValue placeholder="Pick color" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="max-h-[30vh]">
                                        {COLORS.map((color) => (
                                            <SelectItem
                                                key={color.value}
                                                value={color.value}
                                            >
                                                <div
                                                    className="rounded px-2 font-semibold text-white"
                                                    style={{
                                                        backgroundColor:
                                                            color.value,
                                                    }}
                                                >
                                                    {color.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Started At */}
                <div className="flex w-[45%] items-center gap-5">
                    <label className="flex w-[40%] items-center gap-1 text-sm font-medium">
                        <CalendarPlus size={16} /> Started At
                    </label>
                    <FormField
                        control={form.control}
                        name="started_at"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ProjectForm.DATEPICKER
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Deadline */}
                <div className="flex w-[45%] items-center gap-5">
                    <label className="flex w-[40%] items-center gap-1 text-sm font-medium">
                        <CalendarCheck size={16} /> Deadline
                    </label>
                    <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ProjectForm.DATEPICKER
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Completed At */}
                <div className="flex w-[45%] items-center gap-5">
                    <label className="flex w-[40%] items-center gap-1 text-sm font-medium">
                        <CalendarMinus size={16} /> Completed At
                    </label>
                    <FormField
                        control={form.control}
                        name="completed_at"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ProjectForm.DATEPICKER
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
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

ProjectForm.DATEPICKER = ({
    value,
    onChange,
}: {
    value?: string;
    onChange: (value: string) => void;
}) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <span
                    className={cn(
                        'w-full text-sm font-semibold',
                        'flex items-center gap-2 cursor-pointer',
                        !value && 'text-muted-foreground',
                        'hover:bg-gray-100 py-1 px-2 rounded',
                    )}
                >
                    <CalendarClock size={16} />
                    {value ? dayjs(value).format('DD/MM/YYYY') : 'Pick a date'}
                </span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="top">
                <Calendar
                    mode="single"
                    selected={value ? dayjs(value).toDate() : undefined}
                    onSelect={(date) => {
                        date &&
                            onChange(
                                toDBTime(dayjs(date).startOf('day').toString()),
                            );
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};

export default ProjectForm;
