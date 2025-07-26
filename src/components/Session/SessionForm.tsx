import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import DatePicker from '@/components/form/DatePicker';
import ProjectPicker from '@/components/session/ProjectPicker';
import TagPicker from '@/components/session/TagPicker';
import { DEFAULT_SESSION_VALUES } from '@/constants/session';
import { useCreateSession, useSessionById, useUpdateSession } from '@/hooks/useSession';
import {
    CreateSession,
    CreateSessionSchema,
    UpdateSession,
    UpdateSessionSchema,
} from '@/schema/SessionSchema';
import { useEffect } from 'react';

import { useSessionCollision } from '@/hooks/useSession';
import { useTimer } from '@/hooks/useTimer';
import { toDBTime } from '@/lib/time';
import dayjs from 'dayjs';
import { Calendar, CalendarMinus, CalendarPlus, Clock, Folder, Tag } from 'lucide-react';
import { toast } from 'sonner';
import DurationElement from '../form/DurationElement';
import RichEditor from '../form/Editor';
import TimeElement from '../form/TimeElement';
import Title from '../form/Title';
import LoaderWrapper from '../layouts/Loader';
import { Separator } from '../ui/separator';

type PropType = {
    sessionId?: number | null;
    closeModal: () => void;
};

const SessionForm = ({ sessionId, closeModal }: PropType) => {
    const { data: session } = useSessionById(sessionId);
    const { data: timer } = useTimer();

    const { mutate: createSession } = useCreateSession();
    const { mutate: updateSession } = useUpdateSession();
    const { mutateAsync: checkSessionCollision } = useSessionCollision();

    const form = useForm({
        resolver: zodResolver(sessionId ? UpdateSessionSchema : CreateSessionSchema),
        defaultValues: DEFAULT_SESSION_VALUES,
    });

    useEffect(() => {
        if (session) {
            form.reset({
                ...session,
                project_id: session.project.id,
                tags: session.tags.map((tag) => tag.id),
            });
        }
        form.setFocus('title');
    }, [session]);

    const adjustDuration = () => {
        const breakDuration = form.getValues('break_duration_sec') ?? 0;
        const startTime = dayjs(form.getValues('start_time'));
        const endTime = dayjs(form.getValues('end_time'));

        if (startTime && endTime) {
            const duration = endTime.diff(startTime, 'second');
            if (duration < breakDuration) {
                form.setError('break_duration_sec', {
                    message: 'Break duration must be less than session duration',
                });
                return;
            }
            form.setValue('session_duration_sec', duration - breakDuration);
        }
    };

    const setDateToTimes = () => {
        const startTime = dayjs(form.getValues('start_time'));
        const endTime = dayjs(form.getValues('end_time'));
        const date = form.getValues('date');

        let newStartTime = dayjs(date)
            .hour(startTime.hour())
            .minute(startTime.minute())
            .second(startTime.second());
        form.setValue('start_time', toDBTime(newStartTime.toString()));

        if (endTime.isValid()) {
            let newEndTime = dayjs(date)
                .hour(endTime.hour())
                .minute(endTime.minute())
                .second(endTime.second());
            form.setValue('end_time', toDBTime(newEndTime.toString()));
        }
    };

    const handleClose = () => {
        closeModal();
        form.reset();
    };

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
        handleClose();
    }

    if (sessionId && !session) {
        return <LoaderWrapper />;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* title */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Title
                                    ref={field.ref}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage className="text-xs mt-1" />
                        </FormItem>
                    )}
                />

                <Separator />

                <div className="flex gap-6 w-full max-sm:flex-col">
                    {/* Project */}
                    <FormField
                        control={form.control}
                        name="project_id"
                        render={({ field }) => (
                            <FormItem className="w-1/2 flex items-center gap-5">
                                <FormLabel className="min-w-24 font-semibold">
                                    <Folder size={16} /> Project
                                </FormLabel>
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

                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem className="w-1/2 flex items-center gap-5">
                                <FormLabel className="min-w-24 font-semibold">
                                    <Tag size={16} />
                                    Tags
                                </FormLabel>
                                <TagPicker
                                    sessionId={session?.id}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex gap-6 w-full max-sm:flex-col">
                    {/* Date */}
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="w-1/2 flex items-center gap-5">
                                <FormLabel className="min-w-24 font-semibold">
                                    <Calendar size={16} /> Date
                                </FormLabel>
                                <FormControl>
                                    <DatePicker
                                        dateValue={field.value}
                                        onChange={field.onChange}
                                        setDateToTimes={setDateToTimes}
                                        disable={
                                            session !== null &&
                                            sessionId === timer?.session_id
                                        }
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </div>

                <Separator />

                <div className="flex gap-6 w-full max-sm:flex-col items-start">
                    {/* Start Time */}
                    <FormField
                        control={form.control}
                        name="start_time"
                        render={({ field }) => (
                            <FormItem className="w-1/2 flex items-center gap-5">
                                <FormLabel className="min-w-24 font-semibold">
                                    <CalendarPlus size={16} /> Start Time
                                </FormLabel>
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
                                        session !== null &&
                                        sessionId === timer?.session_id
                                    }
                                    adjustDuration={adjustDuration}
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
                                <FormItem className="w-1/2 flex items-center gap-5">
                                    <FormLabel className="min-w-24 font-semibold">
                                        <CalendarMinus size={16} /> End Time
                                    </FormLabel>
                                    <TimeElement
                                        value={field.value ? field.value : undefined}
                                        setValue={field.onChange}
                                        setError={(message) =>
                                            message
                                                ? form.setError('end_time', {
                                                      message,
                                                  })
                                                : form.clearErrors('end_time')
                                        }
                                        date={form.getValues('date')}
                                        adjustDuration={adjustDuration}
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
                                <FormItem className="w-1/2 flex items-center gap-5">
                                    <FormLabel className="min-w-24 font-semibold">
                                        <Clock size={16} />
                                        Duration
                                    </FormLabel>
                                    <DurationElement
                                        value={field.value}
                                        onChange={field.onChange}
                                        setError={(message) =>
                                            form.setError('session_duration_sec', {
                                                message,
                                            })
                                        }
                                        isSession={true}
                                        clearError={() =>
                                            form.clearErrors('session_duration_sec')
                                        }
                                        adjustDuration={adjustDuration}
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
                                <FormItem className="w-1/2 flex items-center gap-5">
                                    <FormLabel className="min-w-24 font-semibold">
                                        <Clock size={16} />
                                        Break
                                    </FormLabel>
                                    <DurationElement
                                        value={field.value}
                                        onChange={field.onChange}
                                        setError={(message) =>
                                            form.setError('break_duration_sec', {
                                                message,
                                            })
                                        }
                                        isSession={true}
                                        clearError={() =>
                                            form.clearErrors('break_duration_sec')
                                        }
                                        adjustDuration={adjustDuration}
                                    />
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RichEditor
                                    value={field.value ? field.value : undefined}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <div className="flex justify-center items-center gap-2">
                    <Button
                        type="button"
                        className="cursor-pointer"
                        variant={'outline'}
                        onClick={handleClose}
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
