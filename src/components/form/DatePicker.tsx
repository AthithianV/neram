import { formatDate } from '@/lib/time';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { useState } from 'react';

import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { DB_DATE_FORMAT } from '@/constants/session';
import { useSettings } from '@/hooks/useSettings';
import { XCircleIcon } from 'lucide-react';
import { Input } from '../ui/input';

type PropsType = {
    dateValue?: string | null;
    onChange: (date: string | null) => void;
    disable?: boolean;
    format?: string;
    nullable?: boolean;
    startOf?: boolean;
    endOf?: boolean;
};

const DatePicker = ({
    dateValue,
    onChange,
    disable,
    format,
    nullable,
    startOf,
    endOf,
}: PropsType) => {
    const [open, setOpen] = useState(false);
    const { data: settings } = useSettings();

    const handleSelect = (date: Date | undefined) => {
        if (date) {
            let pickedDate = dayjs(date);
            if (startOf) {
                pickedDate = pickedDate.startOf('day');
            }
            if (endOf) {
                pickedDate = pickedDate.endOf('day');
            }
            date &&
                onChange(
                    formatDate(pickedDate, {
                        format: format ? format : DB_DATE_FORMAT,
                    }),
                );
            setOpen(false);
        }
    };

    const clearDate = () => {
        onChange(null);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="relative">
                    <Input
                        className={cn(
                            '!w-45 !h-8 hover:bg-gray-100 font-semibold cursor-pointer',
                            'shadow-none text-center',
                            open && 'border-b-2 border-sky-500',
                        )}
                        value={
                            dateValue
                                ? formatDate(dateValue, {
                                      format: settings?.date_format,
                                  })
                                : 'Pick a date'
                        }
                        readOnly
                        disabled={disable}
                    />
                    {open && nullable && (
                        <span
                            className={cn(
                                'absolute right-2 top-2',
                                ' text-gray-300  hover:text-gray-400',
                                'cursor-pointer',
                            )}
                            onClick={() => clearDate()}
                        >
                            <XCircleIcon className="h-4 w-4" />
                        </span>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="bottom">
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
