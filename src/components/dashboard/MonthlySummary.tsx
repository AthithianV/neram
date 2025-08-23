import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMonthlySummary } from '@/hooks/useSummary';
import { formatDuration } from '@/lib/time';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const MonthlySummary = () => {
    const [month, setMonth] = useState(dayjs());

    const { data: monthlyReport, isLoading } = useMonthlySummary(
        month.get('year'),
        month.get('month') + 1,
    );

    function getLevel(durationSec: number): number {
        if (durationSec === 0) return 0;
        const hours = durationSec / 3600;

        if (hours < 1) return 0;
        if (hours < 2) return 1;
        if (hours < 3) return 2;
        if (hours < 4) return 3;
        if (hours < 5) return 4;
        if (hours < 6) return 5;
        if (hours < 7) return 6;
        return 7;
    }

    const levelColors = [
        'bg-gray-200 dark:bg-gray-700 text-gray-300',
        'bg-green-300',
        'bg-green-400',
        'bg-green-500',
        'bg-green-600',
        'bg-green-700',
        'bg-green-800',
        'bg-green-900',
    ];

    if (isLoading || !monthlyReport) {
        return <Skeleton className="h-168 col-span-2" />;
    }

    const incrementMonth = () => {
        if (month.get('month') === dayjs().get('month')) {
            return;
        }
        setMonth(month.add(1, 'month'));
    };

    const decrementMonth = () => {
        setMonth(month.subtract(1, 'month'));
    };

    return (
        <Card className="flex flex-col col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Button variant={'ghost'} onClick={decrementMonth}>
                        <ChevronLeft />
                    </Button>
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>{month.format('MMMM YYYY')}</span>
                    <Button
                        variant={'ghost'}
                        onClick={incrementMonth}
                        disabled={month.get('month') === dayjs().get('month')}
                    >
                        <ChevronRight />
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent
                className={cn('flex flex-col flex-1 gap-5', 'py-2 px-25 max-xl:px-5')}
            >
                {/* Calendar Grid */}
                <div className="space-y-2">
                    <div className="grid grid-cols-7 text-center font-semibold">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                            <div key={d}>{d}</div>
                        ))}
                    </div>
                    {monthlyReport.calendar_view.map((week, i) => (
                        <div key={i} className="grid grid-cols-7 gap-1">
                            {week.days.map((day, j) =>
                                day ? (
                                    <Tooltip key={j}>
                                        <TooltipTrigger>
                                            <div
                                                className={cn(
                                                    'w-[80px] h-[80px] max-lg:w-[60px] max-lg:h-[60px]',
                                                    'rounded-md',
                                                    'flex items-center justify-center',
                                                    'text-xs font-medium',
                                                    'text-gray-800',
                                                    levelColors[
                                                        getLevel(day.total_duration_sec)
                                                    ],
                                                )}
                                            >
                                                <h3 className="text-sm">
                                                    {dayjs(day.date).date()}
                                                </h3>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="flex flex-col gap-2">
                                            <h5 className="flex gap-2">
                                                <span>Focus Hours:</span>
                                                <span className="font-bold">
                                                    {formatDuration(
                                                        day.total_duration_sec,
                                                    ) ?? 0}
                                                </span>
                                            </h5>
                                            <h5 className="flex gap-2">
                                                <span>Number of Sessions: </span>
                                                <span className="font-bold">
                                                    {day.session_count ?? 0}
                                                </span>
                                            </h5>
                                            <h5 className="flex gap-2">
                                                <span>Task Completed:</span>
                                                <span className="font-bold">
                                                    {day.completed_task_count ?? 0}
                                                </span>
                                            </h5>
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <div key={j}></div>
                                ),
                            )}
                        </div>
                    ))}
                </div>
                {/* Stats */}
                {/* <div className="flex justify-between text-center text-sm">
                    <div>
                        <p className="font-bold">
                            {monthlyReport.monthly_summary.total_days_worked} of 19
                        </p>
                        <p className="text-muted-foreground">Days Focused</p>
                    </div>
                    <div>
                        <p className="font-bold">
                            {formatDuration(
                                monthlyReport.monthly_summary.avg_duration_per_day,
                            )}
                        </p>
                        <p className="text-muted-foreground">Avg Focus Day</p>
                    </div>
                    <div>
                        <p className="font-bold">
                            {formatDuration(
                                monthlyReport.monthly_summary.total_duration_sec,
                            )}
                        </p>
                        <p className="text-muted-foreground">Total Focus</p>
                    </div>
                </div> */}
            </CardContent>
        </Card>
    );
};

export default MonthlySummary;
