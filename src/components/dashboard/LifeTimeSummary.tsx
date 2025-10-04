import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLifeTimeSummary } from '@/hooks/useSummary';
import { formatDuration } from '@/lib/time';
import { Target } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const LifeTimeSummary = () => {
    const { data: lifeTimeSummary, isLoading } = useLifeTimeSummary();

    if (isLoading || !lifeTimeSummary) {
        return <Skeleton className="h-50" />;
    }

    return (
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    Lifetime Focus
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Your total focus achievements since you started using Neram.
                </p>
            </CardHeader>
            <CardContent className="flex gap-4">
                <div className="flex-1 rounded-[5px] bg-muted p-4 text-center">
                    <p className="text-2xl font-bold">
                        {formatDuration(lifeTimeSummary.duration_sec)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Total Focus Time
                    </p>
                </div>
                <div className="flex-1 rounded-[5px] bg-muted p-4 text-center">
                    <p className="text-2xl font-bold">
                        {lifeTimeSummary.session_count}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Total Sessions
                    </p>
                </div>
                <div className="flex-1 rounded-[5px] bg-muted p-4 text-center">
                    <p className="text-2xl font-bold">
                        {lifeTimeSummary.focused_day_count}
                    </p>
                    <p className="text-sm text-muted-foreground">Focus Days</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default LifeTimeSummary;
