import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DATE_FORMAT_OPTIONS, TIME_FORMAT_OPTIONS } from '@/constants/times';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import dayjs from 'dayjs';
import ToggleTheme from '../theme/ToggleTheme';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';

const General = () => {
    const { data: settings, isLoading } = useSettings();
    const { mutateAsync: updateSettings } = useUpdateSettings();

    const handleDateFormatChange = (val: string) => {
        updateSettings({ settingsToUpdate: { date_format: val } });
    };

    const handleTimeFormatChange = (val: string) => {
        updateSettings({ settingsToUpdate: { time_format: val } });
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex flex-col gap-4">
                    <Skeleton className="h-[5vh] w-[25vw]" />
                    <Skeleton className="h-[5vh] w-[25vw]" />
                    <Skeleton className="h-[5vh] w-[25vw]" />
                    <Skeleton className="h-[5vh] w-[25vw]" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-[120px_1fr] items-center gap-5">
                    <Label>Theme</Label>
                    <ToggleTheme />
                </div>

                <div className="grid grid-cols-[120px_1fr] items-center gap-5">
                    <Label>Date Format</Label>
                    <Select
                        defaultValue={settings?.date_format}
                        onValueChange={handleDateFormatChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a Date Format" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {DATE_FORMAT_OPTIONS.map((option) => (
                                    <SelectItem value={option.value} key={option.value}>
                                        <span>{dayjs().format(option.value)}</span>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-[120px_1fr] items-center gap-5">
                    <Label>Time Format</Label>
                    <Select
                        defaultValue={settings?.time_format}
                        onValueChange={handleTimeFormatChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a Time Format" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[30vh]">
                            <SelectGroup>
                                {TIME_FORMAT_OPTIONS.map((option) => (
                                    <SelectItem value={option.value} key={option.value}>
                                        <span>{option.label}</span>
                                        <span>{dayjs().format(option.value)}</span>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
};

export default General;
