import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMonthlySummary } from '@/hooks/useSummary';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const MonthlySummary = () => {
    const { data: weeks, isLoading } = useMonthlySummary(2025, 8);

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

    if (isLoading || !weeks) {
        return <Skeleton className="h-50" />;
    }

    return (
        <Card className="flex flex-col col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    June 2025
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 px-25 py-2 gap-5">
                {/* Calendar Grid */}
                <div className="space-y-2">
                    <div className="grid grid-cols-7 text-center font-semibold">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                            <div key={d}>{d}</div>
                        ))}
                    </div>
                    {weeks.map((week, i) => (
                        <div key={i} className="grid grid-cols-7 gap-1">
                            {week.days.map((day, j) =>
                                day ? (
                                    <div
                                        key={j}
                                        className={cn(
                                            'w-[80px] h-[80px]',
                                            'rounded-md',
                                            'flex items-center justify-center',
                                            'text-xs font-medium',
                                            'text-gray-800',
                                            levelColors[getLevel(day.total_duration_sec)],
                                        )}
                                    >
                                        <h3 className="text-sm">
                                            {dayjs(day.date).date()}
                                        </h3>
                                        {/* <div>{day.date % 100}</div>
                                        <div className="text-gray-500">
                                            S: {day.session_count}
                                        </div>
                                        <div className="text-gray-500">
                                            T: {day.completed_task_count}
                                        </div> */}
                                    </div>
                                ) : (
                                    <div key={j}></div>
                                ),
                            )}
                        </div>
                    ))}
                </div>
                {/* Stats */}
                <div className="flex justify-between text-center text-sm">
                    <div>
                        <p className="font-bold">19 of 19</p>
                        <p className="text-muted-foreground">Days Focused</p>
                    </div>
                    <div>
                        <p className="font-bold">5h 18m</p>
                        <p className="text-muted-foreground">Avg Focus Day</p>
                    </div>
                    <div>
                        <p className="font-bold">100h 47m</p>
                        <p className="text-muted-foreground">Total Focus</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default MonthlySummary;
