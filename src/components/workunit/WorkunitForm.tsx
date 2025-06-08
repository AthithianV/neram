import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

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
import WorkunitSchema from '@/schema/WorkunitSchema';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';
import { Workunit } from '@/schema/WorkunitSchema';
import { DEFAULT_WORKUNIT_VALUES } from '@/constants/workunit';
import { useWorkunitById } from '@/hooks/useWorkunit';
import DatePicker from '../form/DatePicker';
import TaskPicker from './TaskPicker';
import { DEFAULT_TIME_ZONE } from '@/constants/times';

dayjs.extend(utc);
dayjs.extend(timezone);

export const WorkunitForm = () => {
    const form = useForm<Workunit>({
        resolver: zodResolver(WorkunitSchema),
        defaultValues: DEFAULT_WORKUNIT_VALUES,
    });

    const { workunitId } = useParams();
    const { data: workunit } = useWorkunitById(workunitId || '');

    useEffect(() => {
        if (workunit) {
            form.setValue('title', workunit.title || '');
            form.setValue('description', workunit.description || '');
            form.setValue('task', workunit.task);
            form.setValue(
                'date',
                dayjs(workunit.date).tz(DEFAULT_TIME_ZONE).toDate()
            );
            form.setValue(
                'start_time',
                dayjs(workunit.start_time).tz(DEFAULT_TIME_ZONE).toDate()
            );
            form.setValue(
                'end_time',
                dayjs(workunit.end_time).tz(DEFAULT_TIME_ZONE).toDate()
            );
            form.setValue('session_duration', workunit.session_duration);
            form.setValue('break_duration', workunit.break_duration);
        }
    }, [workunit]);

    const navigate = useNavigate();

    function onSubmit(data: z.infer<typeof WorkunitSchema>) {
        toast('Work unit has been Created');
        console.log(data);
        navigate('/dashboard');
    }

    const handleError = (error: string, field: keyof Workunit) => {
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
                    {workunit ? 'Edit Work Unit' : 'Add new Work Unit'}
                </h1>
                <p className="text-sm text-muted-foreground mb-6">
                    {workunit
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
                    {/* Task */}
                    <FormField
                        control={form.control}
                        name="task"
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

                    {/* Date */}
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col flex-1">
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
                </div>

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
