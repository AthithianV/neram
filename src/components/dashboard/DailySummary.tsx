import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDaySummary } from '@/hooks/useSummary';
import { formatDate, formatDuration } from '@/lib/time';
import dayjs from 'dayjs';
import { Clock } from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from '../ui/skeleton';

const DailySummary = () => {
    const [date, _] = useState(
        formatDate(dayjs().subtract(1, 'day'), { shouldClearTime: true }),
    );
    const { data: dailySummary, isLoading } = useDaySummary(date);

    if (isLoading || !dailySummary) {
        return <Skeleton className="h-50" />;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Today’s Focus
                </CardTitle>
                <p className="text-sm text-muted-foreground">Thursday, June 19</p>
            </CardHeader>
            <CardContent className="flex gap-4">
                <div className="flex-1 rounded-lg bg-muted p-4 text-center">
                    <p className="text-2xl font-bold">
                        {formatDuration(dailySummary.total_duration_sec)}
                    </p>
                    <p className="text-sm text-muted-foreground">Focus Time</p>
                </div>
                <div className="flex-1 rounded-lg bg-muted p-4 text-center">
                    <p className="text-2xl font-bold">{dailySummary?.count}</p>
                    <p className="text-sm text-muted-foreground">Sessions</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default DailySummary;
