import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import TaskSchema, { Task } from '@/schema/TaskSchema';
import {
    CalendarCheck,
    CalendarMinus,
    CalendarPlus,
    Clock3,
    Flag,
    Folder,
    Gauge,
} from 'lucide-react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';

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
import { toDBTime } from '@/lib/time';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import DatePicker from '../form/DatePicker';
import DurationElement from '../form/DurationElement';
import RichEditor from '../form/Editor';
import Selector from '../form/Selector';
import ProjectPicker from '../session/ProjectPicker';
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

    useEffect(() => {
        if (form.getValues('status') === 'Completed') {
            form.setValue('completed_at', toDBTime(dayjs().startOf('day').toString()));
        } else {
            form.setValue('completed_at', null);
        }
    }, [form.watch('status')]);

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-[50vw]">
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

                {/* Priority */}
                <div className="flex gap-6 w-full max-sm:flex-col">
                    <FormField
                        control={form.control}
                        name="project_id"
                        render={({ field }) => (
                            <FormItem className="w-1/2 flex items-center gap-5">
                                <FormLabel className="w-32 font-semibold">
                                    <div className="flex items-center gap-1">
                                        <Folder size={16} /> Project
                                    </div>
                                    <FormMessage className="text-xs" />
                                </FormLabel>
                                <ProjectPicker
                                    onChange={field.onChange}
                                    value={field.value}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem className="w-1/2 flex items-center gap-5">
                                <FormLabel className="w-32 font-semibold">
                                    <div className="flex items-center gap-1">
                                        <Flag size={16} /> Priority
                                    </div>
                                    <FormMessage className="text-xs" />
                                </FormLabel>
                                <Selector
                                    onChange={field.onChange}
                                    value={field.value ?? TASK_PRIORITY[0]}
                                    items={TASK_PRIORITY.map((priority) => ({
                                        title: priority,
                                        value: priority,
                                        color: TASK_PRIORITY_COLOR[
                                            (priority as TaskPriority) ?? 'Default'
                                        ],
                                    }))}
                                    fallbackText="No Priority Available"
                                    placeholder="Select Priority"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Status */}
                <div className="flex gap-6 w-full max-sm:flex-col">
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem className="w-1/2 flex items-center gap-5">
                                <FormLabel className="w-32 font-semibold">
                                    <div className="flex items-center gap-1">
                                        <Gauge size={16} /> Status
                                    </div>
                                    <FormMessage className="text-xs" />
                                </FormLabel>
                                <Selector
                                    onChange={field.onChange}
                                    value={field.value ?? TASK_STATUS[0]}
                                    items={TASK_STATUS.map((status) => ({
                                        title: status,
                                        value: status,
                                        color: TASK_STATUS_COLOR[
                                            (status as TaskStatus) ?? 'Default'
                                        ],
                                    }))}
                                    fallbackText="No Priority Available"
                                    placeholder="Select Priority"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Started At */}
                <div className="flex gap-6 w-full max-sm:flex-col">
                    <FormField
                        control={form.control}
                        name="started_at"
                        render={({ field }) => (
                            <FormItem className="w-1/2 flex items-center gap-5">
                                <FormLabel className="w-32 font-semibold">
                                    <div className="flex items-center gap-1">
                                        <CalendarPlus size={16} /> Started At
                                    </div>
                                    <FormMessage className="text-xs" />
                                </FormLabel>
                                <FormControl>
                                    <DatePicker
                                        dateValue={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                            <FormItem className="w-1/2 flex items-center gap-5">
                                <FormLabel className="w-32 font-semibold">
                                    <div className="flex items-center gap-1">
                                        <CalendarCheck size={16} /> Deadline
                                    </div>
                                    <FormMessage className="text-xs" />
                                </FormLabel>
                                <FormControl>
                                    <DatePicker
                                        dateValue={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Estimated Time */}
                <div className="flex gap-6 w-full max-sm:flex-col">
                    <FormField
                        control={form.control}
                        name="estimated_time"
                        render={({ field }) => (
                            <FormItem className="w-1/2 flex items-center gap-5">
                                <FormLabel className="w-32 font-semibold">
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
                                        clearError={() =>
                                            form.clearErrors('estimated_time')
                                        }
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="completed_at"
                        render={({ field }) => (
                            <FormItem className="w-1/2 flex items-center gap-5">
                                <FormLabel className="w-32 font-semibold">
                                    <div className="flex items-center gap-1">
                                        <CalendarMinus size={16} /> Completed At
                                    </div>
                                    <FormMessage className="text-xs" />
                                </FormLabel>
                                <FormControl>
                                    <DatePicker
                                        dateValue={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Separator />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RichEditor
                                    value={field.value ?? ''}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <div className="flex gap-2 justify-end">
                    <Button
                        variant={'destructive'}
                        onClick={() => closeForm()}
                        type="button"
                    >
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

export default TaskForm;
