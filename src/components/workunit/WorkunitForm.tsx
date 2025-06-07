import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

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
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import TimeElement from '@/components/form/TimeElement';
import DurationElement from '@/components/form/DurationElement';
import WorkunitSchema from '@/schema/WorkunitSchema';
import { Textarea } from '@/components/ui/textarea';
import { SelectGroup, SelectContent } from '@/components/ui/select';
import { Select, SelectItem, SelectValue } from '@/components/ui/select';
import { SelectTrigger } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import useWorkunitStore from '@/store/WorkunitStore';
import { Workunit } from '@/schema/WorkunitSchema';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

const taskOptions = [
    { title: 'Study', value: 'study' },
    { title: 'work', value: 'work' },
];

export const WorkunitForm = ({
    defaultValues,
}: {
    defaultValues?: Workunit;
}) => {
    const form = useForm<Workunit>({
        resolver: zodResolver(WorkunitSchema),
        defaultValues: defaultValues
            ? {
                  ...defaultValues,
                  start_time: dayjs(
                      defaultValues.start_time || new Date()
                  ).toDate(),
                  end_time: dayjs(
                      defaultValues.end_time || new Date()
                  ).toDate(),
              }
            : {
                  id: Date.now(),
                  title: '',
                  description: '',
                  task: '',
                  date: new Date(),
                  start_time: dayjs(new Date()).subtract(1, 'hour').toDate(),
                  end_time: dayjs(new Date()).toDate(),
                  session_duration: 60 * 60,
                  break_duration: 0,
                  tags: [],
              },
    });

    useEffect(() => {
        if (defaultValues) {
            console.log(defaultValues);
        }
    }, []);

    const { addWorkunit } = useWorkunitStore();
    const [calendarOpen, setCalendarOpen] = useState(false);

    function onSubmit(data: z.infer<typeof WorkunitSchema>) {
        toast('Work unit has been Created');
        addWorkunit(data);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 px-8"
            >
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
                                <Textarea {...field} />
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
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a Task" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {taskOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
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
                                    <Popover
                                        open={calendarOpen}
                                        onOpenChange={setCalendarOpen}
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className={cn(
                                                    'w-full justify-start text-left font-normal',
                                                    !field.value &&
                                                        'text-muted-foreground'
                                                )}
                                                onClick={() =>
                                                    setCalendarOpen(true)
                                                }
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? (
                                                    dayjs(field.value).format(
                                                        'DD/MM/YYYY'
                                                    )
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                            side="top"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(date) => {
                                                    if (date)
                                                        field.onChange(date);
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex gap-6 w-full max-sm:flex-col">
                    {/* Start Time */}
                    <FormField
                        control={form.control}
                        name="start_time"
                        render={() => (
                            <FormItem className="flex-1">
                                <FormLabel>Start Time</FormLabel>
                                <TimeElement
                                    value={form.getValues('start_time')}
                                    setValue={(val) =>
                                        form.setValue('start_time', val)
                                    }
                                />
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    {/* End Time */}
                    <FormField
                        control={form.control}
                        name="end_time"
                        render={() => (
                            <FormItem className="flex-1">
                                <FormLabel>End Time</FormLabel>
                                <TimeElement
                                    value={form.getValues('end_time')}
                                    setValue={(val) =>
                                        form.setValue('end_time', val)
                                    }
                                />
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex gap-6 w-full max-sm:flex-col">
                    {/* Start Time */}
                    <FormField
                        control={form.control}
                        name="session_duration"
                        render={() => (
                            <FormItem className="flex-1">
                                <FormLabel>Duration</FormLabel>
                                <DurationElement
                                    value={form.getValues('session_duration')}
                                    setValue={(val) =>
                                        form.setValue('session_duration', val)
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
                        render={() => (
                            <FormItem className="flex-1">
                                <FormLabel>Break</FormLabel>
                                <DurationElement
                                    value={form.getValues('break_duration')}
                                    setValue={(val) =>
                                        form.setValue('break_duration', val)
                                    }
                                />
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-center items-center gap-2">
                    <SheetClose asChild>
                        <Button
                            type="button"
                            className="cursor-pointer"
                            variant={'outline'}
                        >
                            Cancel
                        </Button>
                    </SheetClose>
                    <Button type="submit" className="cursor-pointer">
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export const WorkunitSheet = ({
    defaultValue,
    children,
}: {
    defaultValue?: Workunit;
    children: React.ReactNode;
}) => {
    return (
        <Sheet modal={false}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent
                onPointerDownOutside={(e) => e.preventDefault()}
                className="max-lg:w-8/12 max-sm:w-11/12"
            >
                <SheetHeader className="px-8">
                    <SheetTitle>
                        {defaultValue ? 'Edit Work Unit' : 'Create Work Unit'}
                    </SheetTitle>
                    <SheetDescription>
                        {defaultValue
                            ? 'Edit a work unit to track your time.'
                            : 'Create a new work unit to track your time.'}
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-10/12 max-md:border-t-2 pt-2">
                    <WorkunitForm defaultValues={defaultValue} />
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};
