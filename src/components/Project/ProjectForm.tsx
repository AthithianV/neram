import ProjectSchema, { Project } from '@/schema/ProjectSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Switch } from '../ui/switch';

import { toDBTime } from '@/lib/time';
import { cn } from '@/lib/utils';

import { BILLING_TYPE, CURRENCT_LIST, PROJECT_INITIAL_VALUES } from '@/constants/project';
import { useCreateProject, useProjectById, useUpdateProject } from '@/hooks/useProject';
import {
    CalendarCheck,
    CalendarClock,
    CalendarMinus,
    CalendarPlus,
    CircleDollarSign,
    Gauge,
    Palette,
    Receipt,
    User,
} from 'lucide-react';
import ColorPicker from '../form/ColorPicker';

type PropType = {
    projectId?: number | null;
    closeModal: () => void;
};

const ProjectForm = ({ projectId, closeModal }: PropType) => {
    const { data: project } = useProjectById(projectId);
    const { mutateAsync: createProject } = useCreateProject();
    const { mutateAsync: updateProject } = useUpdateProject();

    const form = useForm<Project>({
        resolver: zodResolver(ProjectSchema),
        defaultValues: project ?? PROJECT_INITIAL_VALUES,
    });

    useEffect(() => {
        if (project) form.reset({ ...project, tags: project.tags ? project.tags : [] });
    }, [project]);

    useEffect(() => {
        if (form.getValues('is_billable') == false) {
            form.setValue('client_name', undefined);
            form.setValue('currency', undefined);
            form.setValue('billing_type', undefined);
            form.setValue('fixed_rate', undefined);
            form.setValue('hourly_rate', undefined);
        }
    }, [form.watch('is_billable')]);

    const onSubmit = async (data: Project) => {
        if (projectId) {
            await updateProject({ projectToUpdate: data, projectId });
        } else {
            await createProject(data);
        }
        form.reset();
        closeModal();
    };

    const closeForm = (state: boolean) => {
        if (state === true) form.reset();
        closeModal();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                <ProjectForm.FREELANCING form={form} />

                {/* Description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <ScrollArea className="max-h-[20vh] w-[48vw]">
                                <FormControl>
                                    <Textarea
                                        placeholder="Write more about your project here..."
                                        rows={4}
                                        {...field}
                                        className="p-0 border-none shadow-none min-h-[15vh] rounded-none text-wrap"
                                    />
                                </FormControl>
                            </ScrollArea>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="destructive" onClick={() => closeForm(false)}>
                        Close
                    </Button>
                    <Button type="submit">Save Project</Button>
                </div>
            </form>
        </Form>
    );
};

ProjectForm.TABLE = ({ form }: { form: any }) => {
    return (
        <div className="space-y-4 border-b-2 pb-4">
            <div className="flex flex-wrap gap-4">
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
                                <FormControl>
                                    <ColorPicker onChange={field.onChange} value={field.value} />
                                </FormControl>
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

ProjectForm.FREELANCING = ({ form }: { form: any }) => {
    return (
        <div className="space-y-4 border-b-2 pb-4">
            <div className="flex items-center space-x-2">
                <FormField
                    control={form.control}
                    name="is_billable"
                    render={({ field }) => (
                        <FormItem>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Label htmlFor="airplane-mode">Freelancing</Label>
            </div>
            {form.watch('is_billable') && (
                <div className="flex flex-wrap gap-4">
                    {/* Client Name */}
                    <div className="flex w-[45%] items-center gap-5">
                        <label className="flex w-[40%] items-center gap-1 text-sm font-medium">
                            <User size={16} /> Client Name
                        </label>
                        <FormField
                            control={form.control}
                            name="client_name"
                            render={({ field }) => (
                                <FormItem>
                                    <Input
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Enter name here..."
                                        className="border-none shadow-none font-semibold"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex w-[45%] items-center gap-5">
                        <label className="flex w-[40%] items-center gap-1 text-sm font-medium">
                            <Receipt size={16} /> Billing Type
                        </label>
                        <FormField
                            control={form.control}
                            name="billing_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger
                                                className={cn(
                                                    'p-2 !h-6 rounded shadow-none border-none',
                                                    'text-white font-semibold',
                                                )}
                                            >
                                                <SelectValue placeholder="Pick billing type..." />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[30vh]">
                                                {BILLING_TYPE.map((type) => (
                                                    <SelectItem key={type.title} value={type.title}>
                                                        <div
                                                            className="rounded px-2 font-semibold text-white"
                                                            style={{
                                                                backgroundColor: type.color,
                                                            }}
                                                        >
                                                            {type.title}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex w-[45%] items-center gap-5">
                        <label className="flex w-[40%] items-center gap-2 text-sm font-medium">
                            <Gauge size={16} />{' '}
                            {form.watch('billing_type') === 'Hourly' ? 'Hourly Rate' : 'Fixed Rate'}
                        </label>
                        <FormField
                            control={form.control}
                            name={
                                form.watch('billing_type') === 'Hourly'
                                    ? 'fixed_rate'
                                    : 'hourly_rate'
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={0}
                                            placeholder="00.00"
                                            className="border-none shadow-none font-semibold"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex w-[45%] items-center gap-5">
                        <label className="flex w-[40%] items-center gap-1 text-sm font-medium">
                            <CircleDollarSign size={16} /> Currency
                        </label>
                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger
                                                    className={cn(
                                                        'p-2 !h-6 rounded shadow-none border-none',
                                                        'text-white font-semibold',
                                                    )}
                                                >
                                                    <SelectValue placeholder="Pick Currency..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-[30vh]">
                                                {CURRENCT_LIST.map(({ code, symbol }) => (
                                                    <SelectItem
                                                        key={code}
                                                        value={code}
                                                        defaultValue={code}
                                                    >
                                                        <div
                                                            className={cn(
                                                                'rounded px-2 font-semibold text-white',
                                                                'flex items-center gap-2',
                                                            )}
                                                            style={{
                                                                backgroundColor: '#14B8A6',
                                                            }}
                                                        >
                                                            <span>{symbol}</span>
                                                            {code}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            )}
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
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
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
                        date && onChange(toDBTime(dayjs(date).startOf('day').toString()));
                        setOpen(false);
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};

export default ProjectForm;
