import { formatDate } from '@/lib/time';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { useState } from 'react';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSettings } from '@/hooks/useSettings';
import { Input } from '../ui/input';

type PropsType = {
    dateValue?: string | null;
    onChange: (date: string) => void;
    disable?: boolean;
};

const DatePicker = ({ dateValue, onChange, disable }: PropsType) => {
    const [open, setOpen] = useState(false);
    const { data: settings } = useSettings();

    const handleSelect = (date: Date | undefined) => {
        date && onChange(formatDate(date));
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Input
                    className={cn(
                        '!w-45 !h-8 hover:bg-gray-100 font-semibold cursor-pointer',
                        'shadow-none',
                        open && 'border-b-2 border-sky-500',
                    )}
                    value={
                        dateValue
                            ? formatDate(dateValue, { format: settings?.date_format })
                            : 'Pick a date'
                    }
                    disabled={disable}
                />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="top">
                <Calendar
                    mode="single"
                    selected={dateValue ? dayjs(dateValue).toDate() : undefined}
                    onSelect={handleSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};

export default DatePicker;
