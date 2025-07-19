import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

import TaskSchema, { Task } from '@/schema/TaskSchema';
import {
    CalendarCheck,
    CalendarClock,
    CalendarMinus,
    CalendarPlus,
    ChevronDown,
    Clock,
    Clock3,
    Flag,
    Gauge,
    Palette,
} from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

import {
    TASK_INTIAL_VALUE,
    TASK_PRIORITY,
    TASK_PRIORITY_COLOR,
    TASK_STATUS,
    TASK_STATUS_COLOR,
    TaskPriority,
    TaskStatus,
} from '@/constants/task';
import { useCreateTask, useTaskById, useUpdateTask } from '@/hooks/useTask';
import { calcualteDuration, formatDuration, toDBTime } from '@/lib/time';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import ColorPicker from '../form/ColorPicker';
import { Calendar } from '../ui/calendar';

type Prop = {
    status: TaskStatus;
    taskId?: number | null;
    closeModal: () => void;
};

const TaskForm = ({ taskId, closeModal, status }: Prop) => {
    const { projectId } = useParams();

    const form = useForm({
        resolver: zodResolver(TaskSchema),
        defaultValues: {
            ...TASK_INTIAL_VALUE,
            project_id: Number(projectId),
            status: status,
        },
    });
    const { mutateAsync: createTask } = useCreateTask();
    const { mutateAsync: updateTask } = useUpdateTask();
    const { data: task } = useTaskById(taskId);

    useEffect(() => {
        if (task) {
            form.reset(task);
            // console.log(form.getValues());
        }
    }, [task]);

    const onSubmit = (data: Task) => {
        if (projectId) {
            if (taskId) {
                updateTask({ taskToUpdate: data, taskId });
            } else {
                createTask({ ...data, project_id: Number(projectId) });
            }
            form.reset();
        }
        closeModal();
    };

    const closeForm = () => {
        form.reset();
        closeModal();
    };

    if (taskId && !task) return null;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                    className="!text-3xl font-bold border-none shadow-none px-0 !h-auto !w-full"
                                    value={field.value}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <TaskForm.ATTRIBUTES form={form} />

                {/* description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    value={field.value as string}
                                    onChange={field.onChange}
                                    placeholder="Write more about this task Here..."
                                    rows={4}
                                    className="bg-transparent border-none shadow-none px-1 w-full !text-md max-h-[30vh] overflow-y-auto"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-2 justify-end">
                    <Button variant={'destructive'} onClick={() => closeForm()} type="button">
                        Close
                    </Button>
                    <Button type="submit" disabled={false}>
                        {false ? 'Saving…' : 'Save project'}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

TaskForm.ATTRIBUTES = ({ form }: { form: any }) => {
    const getTaskStatusBg = (value?: string | null) => {
        return {
            backgroundColor: TASK_STATUS_COLOR[(value as TaskStatus) ?? 'Default'],
        };
    };
    const getPriorityColor = (value?: string | null) => {
        return {
            color: TASK_PRIORITY_COLOR[(value as TaskPriority) ?? 'Default'],
        };
    };
    return (
        <div className="border-b-2 pb-4 space-y-4">
            <div className="flex flex-wrap gap-4">
                {/* Status */}
                <div className="flex gap-5 w-[45%] items-center">
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem className="flex justify-between">
                                <FormLabel className="flex-col gap-1 items-start me-4 text-sm font-medium w-30">
                                    <div className="flex items-center gap-1">
                                        <Gauge size={16} /> Status
                                    </div>
                                    <FormMessage className="text-xs" />
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem className="flex justify-between">
                                <FormLabel className="flex-col gap-1 items-start me-4 text-sm font-medium w-30">
                                    <div className="flex items-center gap-1">
                                        <Palette size={16} /> Color
                                    </div>
                                    <FormMessage className="text-xs" />
                                </FormLabel>
                                <FormControl>
                                    <ColorPicker onChange={field.onChange} value={field.value} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Priority */}
                <div className="flex gap-5 w-[45%] items-center">
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem className="flex justify-between">
                                <FormLabel className="flex-col gap-1 items-start me-4 text-sm font-medium w-30">
                                    <div className="flex items-center gap-1">
                                        <Flag size={16} /> Priority
                                    </div>
                                    <FormMessage className="text-xs" />
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger
                                            className={cn(
                                                'hide-arrow ',
                                                'hover:bg-gray-100',
                                                'shadow-none border-none',
                                                'p-1 !h-6 rounded text-gray-900 font-semibold',
                                            )}
                                            style={getPriorityColor(field.value)}
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
                                                    fill={TASK_PRIORITY_COLOR[p]}
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
                    <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                            <FormItem className="flex justify-between">
                                <FormLabel className="flex-col gap-1 items-start me-4 text-sm w-30">
                                    <div className="flex items-center gap-1">
                                        <CalendarCheck size={16} /> Deadline
                                    </div>
                                    <FormMessage className="text-xs" />
                                </FormLabel>
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
                    <FormField
                        control={form.control}
                        name="started_at"
                        render={({ field }) => (
                            <FormItem className="flex justify-between">
                                <FormLabel className="flex-col gap-1 items-start me-4 text-sm w-30">
                                    <div className="flex items-center gap-1">
                                        <CalendarPlus size={16} /> Started At
                                    </div>
                                    <FormMessage className="text-xs" />
                                </FormLabel>
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
                    <FormField
                        control={form.control}
                        name="completed_at"
                        render={({ field }) => (
                            <FormItem className="flex justify-between">
                                <FormLabel className="flex-col gap-1 items-start me-4 text-sm w-30">
                                    <div className="flex items-center gap-1">
                                        <CalendarMinus size={16} /> Completed At
                                    </div>
                                    <FormMessage className="text-xs" />
                                </FormLabel>
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
                <div className="flex gap-5 w-[45%] items-start ">
                    <FormField
                        control={form.control}
                        name="estimated_time"
                        render={({ field }) => (
                            <FormItem className="flex justify-between items-start">
                                <FormLabel className="flex-col gap-1 items-start me-4 text-sm font-medium w-[38%]">
                                    <div className="flex items-center gap-1">
                                        <Clock3 size={16} /> Estimated Time
                                    </div>
                                    <FormMessage className="text-xs" />
                                </FormLabel>
                                <FormControl>
                                    <TaskForm.DURATION
                                        value={field.value}
                                        onChange={field.onChange}
                                        setError={(msg) =>
                                            form.setError('estimated_time', {
                                                message: msg,
                                            })
                                        }
                                        clearError={() => form.clearErrors('estimated_time')}
                                    />
                                </FormControl>
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
                        'w-30 text-sm ',
                        'flex items-center justify-start gap-2 cursor-pointer',
                        !value && 'text-muted-foreground',
                        'hover:bg-gray-100 py-1 px-1 rounded',
                    )}
                >
                    {icon}
                    {value ? dayjs(value).format('DD/MM/YYYY') : <span>Pick a date</span>}
                </span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={dayjs(value).toDate()}
                    onSelect={(date) => {
                        date &&
                            onChange(
                                toDBTime(dayjs(date).startOf('day').format('YYYY-MM-DD HH:mm:ss')),
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
    clearError,
}: {
    value?: number | null;
    onChange: (duration: number) => void;
    setError: (msg: string | null) => void;
    clearError: () => void;
}) => {
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        setTime(formatDuration(value ? value : 0));
    }, [value]);

    const handleChange = () => {
        const regex = /^\d{2}:\d{2}:\d{2}$/;
        const isValid = regex.test(time);
        if (isValid) {
            onChange(calcualteDuration(time));
            clearError();
        } else {
            setError('Format HH:MM:SS');
        }
    };

    return (
        <div className="flex gap-2 items-center justify-center">
            <Clock size={16} />
            <Input
                value={time}
                onChange={(e) => {
                    setTime(e.target.value);
                    clearError();
                }}
                className="h-5 px-0 text-start border-none shadow-none rounded-none"
                onBlur={handleChange}
            />
        </div>
    );
};

export default TaskForm;
