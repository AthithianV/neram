import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Badge } from '../ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

import TaskSchema, { Task } from '@/schema/TaskSchema';
import {
    CalendarCheck,
    CalendarClock,
    CalendarMinus,
    CalendarPlus,
    ChevronDown,
    Clock,
    Clock1,
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

import { COLORS } from '@/constants/colors';
import {
    TASK_PRIORITY,
    TASK_PRIORITY_COLOR,
    TASK_STATUS,
    TASK_STATUS_COLOR,
    TaskPriority,
    TaskStatus,
} from '@/constants/project';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { Calendar } from '../ui/calendar';
import { calcualteDuration, formatDuration, toDBTime } from '@/lib/time';

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
    const getTaskStatusBg = (value?: string | null) => {
        return {
            backgroundColor:
                TASK_STATUS_COLOR[(value as TaskStatus) ?? 'Default'],
        };
    };
    const getPriorityColor = (value?: string | null) => {
        return {
            color: TASK_PRIORITY_COLOR[(value as TaskPriority) ?? 'Default'],
        };
    };
    return (
        <div className="border-b-2 pb-4 space-y-4">
            <div className="flex flex-wrap gap-2">
                {/* Status */}
                <div className="flex gap-5 w-[45%] items-center">
                    <label className="flex items-center gap-1 text-sm font-medium w-[50%]">
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
                                            className=" hide-arrow shadow-none border-none p-2 !h-6 rounded text-white font-semibold "
                                            style={getTaskStatusBg(field.value)}
                                        >
                                            <SelectValue
                                                placeholder="Pick status"
                                                className="text-black"
                                            />
                                            <ChevronDown
                                                className="text-white font"
                                                strokeWidth={3}
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
                    <label className="flex items-center gap-1 text-sm font-medium w-[50%]">
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
                                            className="hide-arrow shadow-none border-none p-2 !h-6 rounded text-white font-semibold"
                                            style={
                                                field.value
                                                    ? {
                                                          backgroundColor:
                                                              field.value,
                                                      }
                                                    : {}
                                            }
                                        >
                                            <SelectValue placeholder="Pick color" />
                                            <ChevronDown
                                                className="text-white font"
                                                strokeWidth={3}
                                            />
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

                {/* Priority */}
                <div className="flex gap-5 w-[45%] items-center">
                    <label className="flex items-center gap-1 text-sm font-medium w-[50%]">
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
                                        <SelectTrigger
                                            className={cn(
                                                'hide-arrow ',
                                                'hover:bg-gray-100',
                                                'shadow-none border-none',
                                                'p-2 !h-6 rounded text-gray-900 font-semibold',
                                            )}
                                            style={getPriorityColor(
                                                field.value,
                                            )}
                                        >
                                            <SelectValue placeholder="Pick priority" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {TASK_PRIORITY.map((p) => (
                                            <SelectItem
                                                style={getPriorityColor(p)}
                                                key={p}
                                                value={p}
                                                className="font-semibold"
                                            >
                                                <Flag
                                                    className={`text-${TASK_PRIORITY_COLOR[p]}`}
                                                    fill={
                                                        TASK_PRIORITY_COLOR[p]
                                                    }
                                                />
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
                    <label className="flex items-center gap-1 text-sm font-medium w-[50%]">
                        <CalendarCheck size={16} /> Deadline
                    </label>
                    <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <TaskForm.DATEPICKER
                                        icon={<CalendarClock size={16} />}
                                        value={field.value}
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
                    <label className="flex items-center gap-1 text-sm font-medium w-[50%]">
                        <CalendarPlus size={16} /> Started At
                    </label>
                    <FormField
                        control={form.control}
                        name="started_at"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <TaskForm.DATEPICKER
                                        icon={<CalendarClock size={16} />}
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
                <div className="flex gap-5 w-[45%] items-center">
                    <label className="flex items-center gap-1 text-sm font-medium w-[50%]">
                        <CalendarMinus size={16} /> Completed At
                    </label>
                    <FormField
                        control={form.control}
                        name="completed_at"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <TaskForm.DATEPICKER
                                        icon={<CalendarClock size={16} />}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Estimated Time */}
                <div className="flex gap-5 w-[60%] items-center">
                    <label className="flex items-center gap-1 me-4 text-sm font-medium w-[36%]">
                        <Clock3 size={16} /> Estimated Time
                    </label>
                    <FormField
                        control={form.control}
                        name="estimated_time"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <TaskForm.DURATION
                                        value={field.value}
                                        onChange={field.onChange}
                                        setError={(msg) =>
                                            form.setError('estimated_time', {
                                                message: msg,
                                            })
                                        }
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

TaskForm.DATEPICKER = ({
    value,
    onChange,
    icon,
}: {
    value: string;
    onChange: (date: string) => void;
    icon: ReactNode;
}) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <span
                    className={cn(
                        'w-full text-sm font-semibold',
                        'flex items-center justify-center gap-2 cursor-pointer',
                        !value && 'text-muted-foreground',
                        'hover:bg-gray-100 py-1 px-2 rounded',
                    )}
                >
                    {icon}
                    {value ? (
                        dayjs(value).format('DD/MM/YYYY')
                    ) : (
                        <span>Pick a date</span>
                    )}
                </span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="top">
                <Calendar
                    mode="single"
                    selected={dayjs(value).toDate()}
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

TaskForm.DURATION = ({
    value,
    onChange,
    setError,
}: {
    value?: number | null;
    onChange: (duration: number) => void;
    setError: (msg: string) => void;
}) => {
    const [time, setTime] = useState<string>(formatDuration(value ? value : 0));

    const handleChange = () => {
        const regex = /^\d{2}:\d{2}:\d{2}$/;
        const isValid = regex.test(time);
        if (isValid) {
            onChange(calcualteDuration(time));
            setError('');
        } else {
            setError('Format HH:MM:SS');
        }
    };

    return (
        <div className="flex gap-1 items-center justify-center rounded-md">
            <Clock size={16} />
            <Input
                value={time}
                onChange={(e) => {
                    setTime(e.target.value);
                    setError('');
                }}
                className="h-5 px-0 text-start border-none shadow-none"
                onBlur={handleChange}
            />
        </div>
    );
};

export default TaskForm;
