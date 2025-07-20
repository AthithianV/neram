import ProjectSchema, { Project } from '@/schema/ProjectSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Switch } from '../ui/switch';

import { COLORS } from '@/constants/colors';
import {
    BILLING_TYPE,
    CURRENCT_LIST,
    DEFAULT_CURRENCY,
    PROJECT_INITIAL_VALUES,
} from '@/constants/project';
import { useCreateProject, useProjectById, useUpdateProject } from '@/hooks/useProject';
import {
    CalendarCheck,
    CalendarMinus,
    CalendarPlus,
    CircleDollarSign,
    Gauge,
    Palette,
    Receipt,
    User,
} from 'lucide-react';
import ColorPicker from '../form/ColorPicker';
import DatePicker from '../form/DatePicker';
import RichEditor from '../form/Editor';
import Selector from '../form/Selector';
import { Separator } from '../ui/separator';

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-[50vw]">
                {/* Title */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="w-1/2 flex items-center gap-5">
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

                <Separator />

                <div className="flex gap-6 w-full max-sm:flex-col">
                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem className="w-1/2 flex items-center gap-5">
                                <FormLabel className="min-w-24 font-semibold">
                                    <Palette size={16} /> Color
                                </FormLabel>
                                <FormControl>
                                    <ColorPicker onChange={field.onChange} value={field.value} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Started At */}
                    <FormField
                        control={form.control}
                        name="started_at"
                        render={({ field }) => (
                            <FormItem className="w-1/2 flex items-center gap-5">
                                <FormLabel className="min-w-24 font-semibold">
                                    <CalendarPlus size={16} /> Started At
                                </FormLabel>
                                <FormControl>
                                    <DatePicker dateValue={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex gap-6 w-full max-sm:flex-col">
                    {/* Deadline */}
                    <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                            <FormItem className="w-1/2 flex items-center gap-5">
                                <FormLabel className="min-w-24 font-semibold">
                                    <CalendarCheck size={16} /> Deadline
                                </FormLabel>
                                <FormControl>
                                    <DatePicker dateValue={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Completed At */}
                    <FormField
                        control={form.control}
                        name="completed_at"
                        render={({ field }) => (
                            <FormItem className="w-1/2 flex items-center gap-5">
                                <FormLabel className="min-w-24 font-semibold">
                                    <CalendarMinus size={16} /> Completed At
                                </FormLabel>
                                <FormControl>
                                    <DatePicker dateValue={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Separator />

                <FormField
                    control={form.control}
                    name="is_billable"
                    render={({ field }) => (
                        <FormItem className="w-1/2 flex items-center gap-5">
                            <FormLabel className="font-semibold">Freelancing</FormLabel>
                            <Switch
                                checked={field.value ? field.value : false}
                                onCheckedChange={field.onChange}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {form.watch('is_billable') && (
                    <div className="space-y-6">
                        <div className="flex gap-6 w-full max-sm:flex-col">
                            <FormField
                                control={form.control}
                                name="client_name"
                                render={({ field }) => (
                                    <FormItem className="w-1/2 flex items-center gap-5">
                                        <FormLabel className="min-w-32 font-semibold">
                                            <User size={16} /> Client Name
                                        </FormLabel>
                                        <Input
                                            value={field.value ? field.value : undefined}
                                            onChange={field.onChange}
                                            placeholder="Enter name..."
                                            className="input"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="billing_type"
                                render={({ field }) => (
                                    <FormItem className="w-1/2 flex items-center gap-5">
                                        <FormLabel className="min-w-24 font-semibold">
                                            <Receipt size={16} /> Billing Type
                                        </FormLabel>
                                        <FormControl>
                                            <Selector
                                                value={
                                                    field.value
                                                        ? field.value
                                                        : BILLING_TYPE[0].title
                                                }
                                                onChange={field.onChange}
                                                items={BILLING_TYPE.map((type) => ({
                                                    value: type.title,
                                                    color: type.color,
                                                    title: type.title,
                                                }))}
                                                fallbackText="No Type Available"
                                                placeholder="Select Billing TYpe"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-6 w-full max-sm:flex-col">
                            <FormField
                                control={form.control}
                                name={
                                    form.watch('billing_type') === 'Hourly'
                                        ? 'fixed_rate'
                                        : 'hourly_rate'
                                }
                                render={({ field }) => (
                                    <FormItem className="w-1/2 flex items-center gap-5">
                                        <FormLabel className="min-w-32 font-semibold">
                                            <Gauge size={16} />{' '}
                                            {form.watch('billing_type') === 'Hourly'
                                                ? 'Hourly Rate'
                                                : 'Fixed Rate'}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
                                                placeholder="00.00"
                                                className="input"
                                                value={field.value ?? 0}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem className="w-1/2 flex items-center gap-5">
                                        <FormLabel className="min-w-24 font-semibold">
                                            <CircleDollarSign size={16} /> Currency
                                        </FormLabel>
                                        <FormControl>
                                            <Selector
                                                onChange={field.onChange}
                                                value={field.value ?? DEFAULT_CURRENCY}
                                                items={CURRENCT_LIST.map((type) => ({
                                                    value: `${type.symbol} ${type.code}`,
                                                    color: COLORS[4].value,
                                                    title: `${type.symbol} ${type.code}`,
                                                }))}
                                                fallbackText="No Type Available"
                                                placeholder="Select Billing TYpe"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                )}

                <Separator />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RichEditor value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage className="text-xs" />
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

export default ProjectForm;
