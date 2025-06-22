import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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

import TimeElement from '@/components/form/TimeElement';
import DurationElement from '@/components/form/DurationElement';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';
import SessionSchema, { Session } from '@/schema/SessionSchema';
import { DEFAULT_SESSION_VALUES } from '@/constants/session';
import {
    useCreateSession,
    useUpdateSession,
    useSessionById,
} from '@/hooks/useSession';
import DatePicker from '@/components/form/DatePicker';
import TaskPicker from '@/components/Session/TaskPicker';
import ProjectPicker from '@/components/Session/ProjectPicker';
import TagPicker from '@/components/Session/TagPicker';

export const SessionForm = () => {
    const form = useForm<Session>({
        resolver: zodResolver(SessionSchema),
        defaultValues: DEFAULT_SESSION_VALUES,
    });

    const { sessionId } = useParams();
    const { data: session } = useSessionById(sessionId || '');

    const { mutate: createSession } = useCreateSession();
    const { mutate: updateSession } = useUpdateSession();

    useEffect(() => {
        if (session) {
            form.setValue('id', session.id);
            form.setValue('title', session.title || '');
            form.setValue('description', session.description || '');
            form.setValue('task_id', session.task_id);
            form.setValue('project_id', session.project_id);
            form.setValue('date', session.date);
            form.setValue('start_time', session.start_time);
            form.setValue('end_time', session.end_time);
            form.setValue('session_duration', session.session_duration);
            form.setValue('break_duration', session.break_duration);
            form.setValue('tags', session.tags || []);
        }
    }, [session]);

    const navigate = useNavigate();

    function onSubmit(data: z.infer<typeof SessionSchema>) {
        if (session) {
            updateSession(data);
        } else {
            createSession(data);
        }
        navigate('/dashboard');
    }

    const handleError = (error: string, field: keyof Session) => {
        if (error) {
            form.setError(field, { message: error });
        } else {
            form.clearErrors(field);
        }
    };

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
                                    setValue={(val) => field.onChange(val)}
                                    setError={(error) => {
                                        handleError(error, 'start_time');
                                    }}
                                />
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    {/* End Time */}
                    <FormField
                        control={form.control}
                        name="end_time"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>End Time</FormLabel>
                                <TimeElement
                                    value={field.value}
                                    setValue={(val) => field.onChange(val)}
                                    setError={(error) =>
                                        handleError(error, 'end_time')
                                    }
                                />
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex gap-6 w-full max-sm:flex-col items-start">
                    {/* Start Time */}
                    <FormField
                        control={form.control}
                        name="session_duration"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Duration</FormLabel>
                                <DurationElement
                                    value={field.value}
                                    setValue={(val) => field.onChange(val)}
                                    setError={(error) =>
                                        handleError(error, 'session_duration')
                                    }
                                />
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    {/* Break */}
                    <FormField
                        control={form.control}
                        name="break_duration"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Break</FormLabel>
                                <DurationElement
                                    value={field.value}
                                    setValue={(val) => field.onChange(val)}
                                    setError={(error) =>
                                        handleError(error, 'break_duration')
                                    }
                                />
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </div>

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
                            navigate('/dashboard');
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
