import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import {
    PomodoroSettingsSchema,
    PomodoroSettingsValues,
} from '@/schema/PomodoroSchema';
import { POMODORO_SETTINGS_DEFAULT_VALUE } from '@/constants/pomodoro';
import ProjectPicker from '../session/ProjectPicker';
import {
    usePomodoroSettings,
    useUpdatePomodoroSettings,
} from '@/hooks/usePomodoro';
import { useEffect } from 'react';

const PomodoroSettings = () => {
    const { data: pomodoro_settings } = usePomodoroSettings();
    const { mutateAsync: updatePomodoro } = useUpdatePomodoroSettings();

    const form = useForm<PomodoroSettingsValues>({
        resolver: zodResolver(PomodoroSettingsSchema),
        defaultValues: POMODORO_SETTINGS_DEFAULT_VALUE,
    });

    useEffect(() => {
        form.reset({
            ...pomodoro_settings,
            session_duration: (pomodoro_settings?.session_duration ?? 0) / 60,
            break_duration: (pomodoro_settings?.break_duration ?? 0) / 60,
        });
    }, [pomodoro_settings]);

    const autoSync = form.watch('sync_with_time_tracking');

    const onSubmit = async (data: PomodoroSettingsValues) => {
        await updatePomodoro({
            ...data,
            session_duration: data.session_duration * 60,
            break_duration: data.break_duration * 60,
        });
    };

    return (
        <div className="flex justify-end">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Settings className="w-5 h-5" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    align="end"
                    side="top"
                    className="w-100 p-5 max-h-[80vh] overflow-y-auto"
                >
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            {/* Session Duration */}
                            <FormField
                                control={form.control}
                                name="session_duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Session Duration (min)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={10}
                                                max={120}
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value),
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Session Count */}
                            <FormField
                                control={form.control}
                                name="session_count"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Session Count</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={2}
                                                max={10}
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value),
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Break Duration */}
                            <FormField
                                control={form.control}
                                name="break_duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Break Duration (min)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={5}
                                                max={30}
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value),
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Auto Sync */}
                            <FormField
                                control={form.control}
                                name="sync_with_time_tracking"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-[4px] border p-3">
                                        <div>
                                            <FormLabel>Auto Sync</FormLabel>
                                            <FormDescription>
                                                Sync sessions automatically with
                                                project
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Default Project - only if autoSync */}
                            {autoSync && (
                                <FormField
                                    control={form.control}
                                    name="default_project"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-wrap items-center justify-between rounded-[4px] border p-3">
                                            <FormLabel>
                                                Default Project
                                            </FormLabel>
                                            <FormControl>
                                                <ProjectPicker
                                                    onChange={field.onChange}
                                                    value={
                                                        field.value
                                                            ? field.value
                                                            : 0
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Auto Start */}
                            <FormField
                                control={form.control}
                                name="auto_start"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-[4px] border p-3">
                                        <div>
                                            <FormLabel>Auto Start</FormLabel>
                                            <FormDescription>
                                                Automatically start next session
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Notification Sound */}
                            <FormField
                                control={form.control}
                                name="notification_sound"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-[4px] border p-3">
                                        <div>
                                            <FormLabel>
                                                Notification Sound
                                            </FormLabel>
                                            <FormDescription>
                                                Play sound at end of session
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">
                                Save Settings
                            </Button>
                        </form>
                    </Form>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default PomodoroSettings;
