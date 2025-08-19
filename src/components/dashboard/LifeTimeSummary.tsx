import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

const LifeTimeSummary = () => {
    return (
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    Lifetime Focus
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Your total focus achievements since you started using Kairu.
                </p>
            </CardHeader>
            <CardContent className="flex gap-4">
                <div className="flex-1 rounded-lg bg-muted p-4 text-center">
                    <p className="text-2xl font-bold">278h 37m</p>
                    <p className="text-sm text-muted-foreground">Total Focus Time</p>
                </div>
                <div className="flex-1 rounded-lg bg-muted p-4 text-center">
                    <p className="text-2xl font-bold">350</p>
                    <p className="text-sm text-muted-foreground">Total Sessions</p>
                </div>
                <div className="flex-1 rounded-lg bg-muted p-4 text-center">
                    <p className="text-2xl font-bold">50</p>
                    <p className="text-sm text-muted-foreground">Focus Days</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default LifeTimeSummary;
