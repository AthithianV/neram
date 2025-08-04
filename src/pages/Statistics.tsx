import PageAnimation from '@/components/layouts/PageAnimation';
import DurationBarChart from '@/components/statistics/BarChart';
import { Button } from '@/components/ui/button';
import { useStatistics } from '@/hooks/useStatistics';
import { toDBTime } from '@/lib/time';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const Statistics = () => {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const { data } = useStatistics({
        start_date: toDBTime(currentMonth.startOf('month').toDate()),
        end_date: toDBTime(currentMonth.endOf('month').toDate()),
    });

    const handlePrev = () => {
        const newMonth = currentMonth.subtract(1, 'month');
        setCurrentMonth(newMonth);
    };

    const handleNext = () => {
        const newMonth = currentMonth.add(1, 'month');
        setCurrentMonth(newMonth);
    };
    return (
        <PageAnimation>
            <div className="p-2">
                <div className="flex items-center border-2 border-border shadow-md rounded-md w-fit my-2">
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
                <div>
                    <DurationBarChart statistics={data} />
                </div>
            </div>
        </PageAnimation>
    );
};

export default Statistics;
