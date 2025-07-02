import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import dayjs from 'dayjs';

type PropsType = {
    date: string;
    onChange: (date: string) => void;
};

const DatePicker = ({ date, onChange }: PropsType) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <span
                    className={cn(
                        'w-full text-sm font-normal bg-white',
                        'border border-input rounded-md px-3 py-2 shadow-xs',
                        'flex items-center justify-center cursor-pointer',
                        !date && 'text-muted-foreground'
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        dayjs(date).format('DD/MM/YYYY')
                    ) : (
                        <span>Pick a date</span>
                    )}
                </span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="top">
                <Calendar
                    mode="single"
                    selected={dayjs(date).toDate()}
                    onSelect={(date) => {
                        if (date) onChange(dayjs(date).format('DD/MM/YYYY'));
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};

export default DatePicker;
