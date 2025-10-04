import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStreaks } from '@/hooks/useSummary';
import { Flame } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const Streak = () => {
    const { data: streaks, isLoading } = useStreaks();

    if (isLoading || !streaks) {
        return <Skeleton className="h-50" />;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    Streaks
                </CardTitle>
                <p className="text-sm text-green-500">
                    Track your consistency with focus streaks.
                </p>
            </CardHeader>
            <CardContent className="flex gap-4">
                <div className="flex-1 rounded-[5px] bg-muted p-4 text-center">
                    <p className="text-2xl font-bold">
                        {streaks.current_streak} days
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Current Streak
                    </p>
                </div>
                <div className="flex-1 rounded-[5px] bg-muted p-4 text-center">
                    <p className="text-2xl font-bold">
                        {streaks.total_streak} days
                    </p>
                    <p className="text-sm text-muted-foreground">Best Streak</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default Streak;
