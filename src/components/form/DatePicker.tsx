import { toDBTime } from '@/lib/time';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { useState } from 'react';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '../ui/input';

type PropsType = {
    dateValue?: string | null;
    onChange: (date: string) => void;
};

const DatePicker = ({ dateValue, onChange }: PropsType) => {
    const [open, setOpen] = useState(false);

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
                        dateValue ? dayjs(dateValue).format('DD/MM/YYYY') : 'Pick a date'
                    }
                />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="top">
                <Calendar
                    mode="single"
                    selected={dateValue ? dayjs(dateValue).toDate() : undefined}
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

export default DatePicker;
