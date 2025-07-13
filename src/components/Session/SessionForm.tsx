import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

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

import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';
import {
    CreateSessionSchema,
    UpdateSessionSchema,
    CreateSession,
    UpdateSession,
} from '@/schema/SessionSchema';
import {
    DB_DATE_FORMAT,
    DB_TIME_FORMAT,
    DEFAULT_SESSION_VALUES,
    TIME_FORMAT,
} from '@/constants/session';
import {
    useCreateSession,
    useUpdateSession,
    useSessionById,
} from '@/hooks/useSession';
import DatePicker from '@/components/form/DatePicker';
import TaskPicker from '@/components/session/TaskPicker';
import ProjectPicker from '@/components/session/ProjectPicker';
import TagPicker from '@/components/session/TagPicker';

import dayjs from 'dayjs';
import { toDBTime } from '@/lib/time';
import DurationElement from '../form/DurationElement';
import TimeElement from '../form/TimeElement';
import { useTimer } from '@/hooks/useTimer';
import { useSessionCollision } from '@/hooks/useSession';
import { toast } from 'sonner';
import { Bug } from 'lucide-react';

const SessionForm = () => {
    const { sessionId } = useParams();

    const { mutateAsync: checkSessionCollision } = useSessionCollision();

    const { data: session } = useSessionById(
        sessionId ? Number(sessionId) : undefined,
    );

    const { data: timer } = useTimer();

    const { mutate: createSession } = useCreateSession();
    const { mutate: updateSession } = useUpdateSession();

    const isEditMode = !!sessionId;

    const form = useForm({
        resolver: zodResolver(
            isEditMode ? UpdateSessionSchema : CreateSessionSchema,
        ),
        defaultValues: DEFAULT_SESSION_VALUES,
    });

    useEffect(() => {
        form.reset();
        if (session) {
            let session_id = null;
            if (timer) session_id = timer.session_id;

            form.setValue('title', session.title || '');
            form.setValue('description', session.description || '');
            form.setValue('task_id', session.task.id);
            form.setValue('project_id', session.project.id);
            form.setValue('date', toDBTime(session.date));
            form.setValue('start_time', toDBTime(session.start_time));
            form.setValue(
                'end_time',
                session.id === session_id
                    ? undefined
                    : session.end_time
                      ? toDBTime(session.end_time)
                      : undefined,
            );
            form.setValue('session_duration_sec', session.session_duration_sec);
            form.setValue('break_duration_sec', session.break_duration_sec);
            form.setValue('tags', session.tags.map((tag) => tag.id) || []);
        }
    }, [session]);

    useEffect(() => {
        const breakDuration = form.getValues('break_duration_sec') ?? 0;
        const startTime = dayjs(form.getValues('start_time'));
        const endTime = dayjs(form.getValues('end_time'));

        if (startTime && endTime) {
            const duration = endTime.diff(startTime, 'second');
            if (duration < breakDuration) {
                form.setError('break_duration_sec', {
                    message:
                        'Break duration must be less than session duration',
                });
                return;
            }
            form.setValue('session_duration_sec', duration - breakDuration);
        }
    }, [
        form.watch('break_duration_sec'),
        form.watch('start_time'),
        form.watch('end_time'),
    ]);

    useEffect(() => {
        const date = form.getValues('date');
        const startTime = dayjs(form.getValues('start_time'));

        let newStartTime = dayjs(date)
            .hour(startTime.hour())
            .minute(startTime.minute())
            .second(startTime.second());
        form.setValue('start_time', toDBTime(newStartTime.toString()));

        let endTime = dayjs(form.getValues('end_time'));
        if (endTime.isValid()) {
            endTime = dayjs(endTime);
            let newEndTime = dayjs(date)
                .hour(endTime.hour())
                .minute(endTime.minute())
                .second(endTime.second());
            form.setValue('end_time', toDBTime(newEndTime.toString()));
        }
    }, [form.watch('date')]);

    useEffect(() => {
        form.clearErrors();
    }, [form.watch()]);

    const navigate = useNavigate();

    async function onSubmit(data: CreateSession | UpdateSession) {
        const isSessionCollides = await checkSessionCollision({
            startTime: form.getValues('start_time'),
            endTime: form.getValues('end_time') ?? null,
            sessionId: session?.id ?? 0,
        });

        if (isSessionCollides) {
            toast.error('Session collides with another session', {
                description: 'Please Adjust Start and End Time',
            });
            return;
        }

        if (session && session.id) {
            updateSession({
                sessionToUpdate:
                    session.id === timer?.session_id
                        ? {
                              ...data,
                              session_duration_sec: timer?.session_time_elapsed,
                              break_duration_sec: timer?.break_time_elapsed,
                          }
                        : data,
                sessionId: session.id,
            });
        } else {
            createSession(data as CreateSession);
        }
        navigate('/session');
        form.reset();
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 px-8 max-sm:px-4 w-[30vw] max-md:w-fit"
            >
                <h1 className="text-lg font-semibold mb-1">
                    {session ? 'Edit Session' : 'Add new Session'}
                </h1>
                <p className="text-sm text-muted-foreground mb-6">
                    {session
                        ? 'Edit a work unit to track your time.'
                        : 'Create a new work unit to track your time.'}
                </p>
                {/* title */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input {...field} className="bg-white shadow" />
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
                                <Textarea
                                    {...field}
                                    className="bg-white shadow"
                                />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <div className="flex gap-6 w-full max-sm:flex-col">
                    {/* Project */}
                    <FormField
                        control={form.control}
                        name="project_id"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Project</FormLabel>
                                <FormControl>
                                    <ProjectPicker
                                        onChange={field.onChange}
                                        value={field.value}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    {/* Task */}
                    <FormField
                        control={form.control}
                        name="task_id"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Task</FormLabel>
                                <FormControl>
                                    <TaskPicker
                                        onChange={field.onChange}
                                        value={field.value}
                                        projectId={form.watch('project_id')}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Date */}
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                                <DatePicker
                                    date={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <div className="flex gap-6 w-full max-sm:flex-col items-start">
                    {/* Start Time */}
                    <FormField
                        control={form.control}
                        name="start_time"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Start Time</FormLabel>
                                <TimeElement
                                    value={field.value}
                                    setValue={field.onChange}
                                    setError={(message) =>
                                        message
                                            ? form.setError('start_time', {
                                                  message,
                                              })
                                            : form.clearErrors('start_time')
                                    }
                                    date={form.getValues('date')}
                                    isDisable={
                                        session &&
                                        session.id === timer?.session_id
                                    }
                                />
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    {/* End Time */}
                    {(session && session.id == timer?.session_id) || (
                        <FormField
                            control={form.control}
                            name="end_time"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>End Time</FormLabel>
                                    <TimeElement
                                        value={field.value}
                                        setValue={field.onChange}
                                        setError={(message) =>
                                            message
                                                ? form.setError('end_time', {
                                                      message,
                                                  })
                                                : form.clearErrors('end_time')
                                        }
                                        date={form.getValues('date')}
                                    />
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                {(session && session.id == timer?.session_id) || (
                    <div className="flex gap-6 w-full max-sm:flex-col items-start">
                        {/* Start Time */}
                        <FormField
                            control={form.control}
                            name="session_duration_sec"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Duration</FormLabel>
                                    <DurationElement
                                        value={field.value}
                                        setValue={field.onChange}
                                        setError={(message) =>
                                            message
                                                ? form.setError(
                                                      'session_duration_sec',
                                                      {
                                                          message,
                                                      },
                                                  )
                                                : form.clearErrors(
                                                      'session_duration_sec',
                                                  )
                                        }
                                    />
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        {/* Break */}
                        <FormField
                            control={form.control}
                            name="break_duration_sec"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Break</FormLabel>
                                    <DurationElement
                                        value={field.value}
                                        setValue={field.onChange}
                                        setError={(message) =>
                                            message
                                                ? form.setError(
                                                      'break_duration_sec',
                                                      {
                                                          message,
                                                      },
                                                  )
                                                : form.clearErrors(
                                                      'break_duration_sec',
                                                  )
                                        }
                                    />
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                {/* Tags */}
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel>Tags</FormLabel>
                            <TagPicker
                                sessionId={session?.id}
                                value={field.value}
                                onChange={field.onChange}
                            />
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <div className="flex justify-center items-center gap-2">
                    <Button
                        type="button"
                        className="cursor-pointer"
                        variant={'outline'}
                        onClick={() => {
                            form.reset();
                            navigate('/session');
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" className="cursor-pointer">
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default SessionForm;
