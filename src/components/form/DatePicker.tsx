import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toDBTime } from '@/lib/time';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { CalendarClock } from 'lucide-react';
import { ReactNode, useState } from 'react';

type PropsType = {
    dateValue?: string;
    onChange: (date: string) => void;
    icon?: ReactNode;
};

const DatePicker = ({ dateValue, onChange, icon }: PropsType) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <span
                    className={cn(
                        'w-full text-sm font-semibold',
                        'flex items-center gap-2 cursor-pointer',
                        !dateValue && 'text-muted-foreground',
                        'hover:bg-gray-100 py-1 px-2 rounded',
                    )}
                >
                    {icon ? icon : <CalendarClock size={16} />}
                    {dateValue ? dayjs(dateValue).format('DD/MM/YYYY') : 'Pick a date'}
                </span>
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
