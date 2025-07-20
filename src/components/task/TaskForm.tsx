import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

import TaskSchema, { Task } from '@/schema/TaskSchema';
import {
    CalendarCheck,
    CalendarMinus,
    CalendarPlus,
    ChevronDown,
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
import { cn } from '@/lib/utils';
import { useParams } from 'react-router-dom';
import ColorPicker from '../form/ColorPicker';
import DatePicker from '../form/DatePicker';
import DurationElement from '../form/DurationElement';
import RichEditor from '../form/Editor';
import { Separator } from '../ui/separator';

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
                <Separator />

                <TaskForm.ATTRIBUTES form={form} />
                <Separator />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RichEditor value={field.value ?? ''} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <div className="flex gap-2 justify-end">
                    <Button variant={'destructive'} onClick={() => closeForm()} type="button">
                        Close
                    </Button>
                    <Button type="submit" disabled={false}>
                        {false ? 'Saving…' : 'Save Task'}
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
        <div className="space-y-4">
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
                                    <DatePicker dateValue={field.value} onChange={field.onChange} />
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
                                    <DatePicker dateValue={field.value} onChange={field.onChange} />
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
                                    <DatePicker dateValue={field.value} onChange={field.onChange} />
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
                                    <DurationElement
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

export default TaskForm;
