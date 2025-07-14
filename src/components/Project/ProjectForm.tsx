import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import ProjectSchema, { Project } from '@/schema/ProjectSchema';

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

import { PROJECT_INITIAL_VALUES } from '@/constants/project';

type Props = {
    initialValues?: Project;
};

export function ProjectForm({ initialValues }: Props) {
    const form = useForm<Project>({
        resolver: zodResolver(ProjectSchema),
        defaultValues: initialValues ?? PROJECT_INITIAL_VALUES,
    });

    const handleSubmit = async (data: Project) => {
        // await onSubmit(data);
        form.reset(data); // keep the form in sync after save
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
            >
                {/* title */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title *</FormLabel>
                            <FormControl>
                                <Input placeholder="Project X" {...field} />
                            </FormControl>
                            <FormMessage />
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
                                    placeholder="What’s this project about?"
                                    rows={4}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* status -----*/}
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status *</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pick status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {[
                                        'active',
                                        'on‑hold',
                                        'completed',
                                        'archived',
                                    ].map((s) => (
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

                {/* dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(['started_at', 'deadline', 'completed_at'] as const).map(
                        (name) => (
                            <FormField
                                key={name}
                                control={form.control}
                                name={name}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {name
                                                .replace(/_/g, ' ')
                                                .replace(/\b\w/g, (c) =>
                                                    c.toUpperCase(),
                                                )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ),
                    )}
                </div>

                {/* client / color */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="client_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Client</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="ACME Corp."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <FormControl>
                                    <Input
                                        type="color"
                                        className="h-10 w-16 p-0"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* billing ----*/}
                <FormField
                    control={form.control}
                    name="is_billable"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Billable project</FormLabel>
                                <FormDescription>
                                    Untick if work is non‑billable / pro‑bono.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                {/* show rate fields only when billable */}
                {form.watch('is_billable') && (
                    <>
                        <FormField
                            control={form.control}
                            name="billing_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Billing type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="hourly">
                                                Hourly
                                            </SelectItem>
                                            <SelectItem value="fixed">
                                                Fixed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* hourly / fixed conditional fields */}
                        {form.watch('billing_type') === 'hourly' ? (
                            <FormField
                                control={form.control}
                                name="hourly_rate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hourly rate</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <FormField
                                control={form.control}
                                name="fixed_rate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fixed fee</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Currency</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {['INR', 'USD', 'EUR', 'GBP'].map(
                                                (c) => (
                                                    <SelectItem
                                                        key={c}
                                                        value={c}
                                                    >
                                                        {c}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}

                {/* tags ------*/}
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                                {/* Replace with your own fancy multi‑select / chips UI.
                    Here we accept a comma‑sep list of numbers for brevity. */}
                                <Input
                                    placeholder="e.g. 1, 2, 3"
                                    value={field.value.join(', ')}
                                    onChange={(e) =>
                                        field.onChange(
                                            e.target.value
                                                .split(',')
                                                .map((s) => s.trim())
                                                .filter(Boolean)
                                                .map(Number),
                                        )
                                    }
                                />
                            </FormControl>
                            <FormDescription>
                                Temporary input – hook up your own TagPicker
                                later.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* submit ----*/}
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving…' : 'Save project'}
                </Button>
            </form>
        </Form>
    );
}
