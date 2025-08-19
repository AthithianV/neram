import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const MonthlySummary = () => {
    return (
        <Card className="flex flex-col col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    June 2025
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-6">
                    {Array.from({ length: 30 }, (_, i) => (
                        <div
                            key={i}
                            className={`w-16 h-16 rounded-md flex items-center justify-center text-xs font-medium
                ${i < 19 ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground'}`}
                        >
                            {i + 1}
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
