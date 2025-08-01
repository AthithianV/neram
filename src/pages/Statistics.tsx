import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const Statistics = () => {
    const [currentMonth, setCurrentMonth] = useState(dayjs());

    const handlePrev = () => {
        const newMonth = currentMonth.subtract(1, 'month');
        setCurrentMonth(newMonth);
    };

    const handleNext = () => {
        const newMonth = currentMonth.add(1, 'month');
        setCurrentMonth(newMonth);
    };
    return (
        <div>
            <div className="flex items-center bg-white shadow-md rounded-md w-fit">
                {/* Prev Button */}
                <Button
                    onClick={handlePrev}
                    className="h-full rounded-none"
                    variant="ghost"
                >
                    <ChevronLeft />
                </Button>

                {/* Month Name */}
                <span className="text-sm font-semibold text-center border-x-2 px-2 py-1">
                    {currentMonth.format('MMMM YYYY')}
                </span>

                {/* Next Button */}
                <Button
                    onClick={handleNext}
                    className="h-full rounded-none"
                    variant="ghost"
                >
                    <ChevronRight />
                </Button>
            </div>
        </div>
    );
};

export default Statistics;
