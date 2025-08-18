import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Flame, Target } from 'lucide-react';

const Dashboard = () => {
    return (
        <div className="bg-background p-2 text-foreground">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="flex flex-col gap-6">
                    {/* Today’s Focus */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                Today’s Focus
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Thursday, June 19
                            </p>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            <div className="flex-1 rounded-lg bg-muted p-4 text-center">
                                <p className="text-2xl font-bold">7h</p>
                                <p className="text-sm text-muted-foreground">
                                    Focus Time
                                </p>
                            </div>
                            <div className="flex-1 rounded-lg bg-muted p-4 text-center">
                                <p className="text-2xl font-bold">8</p>
                                <p className="text-sm text-muted-foreground">Sessions</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Streaks */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Flame className="h-5 w-5 text-orange-500" />
                                Streaks
                            </CardTitle>
                            <p className="text-sm text-green-500">
                                Today’s focus goal complete! Streak is secure.
                            </p>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            <div className="flex-1 rounded-lg bg-muted p-4 text-center">
                                <p className="text-2xl font-bold">50 days</p>
                                <p className="text-sm text-muted-foreground">
                                    Current Streak
                                </p>
                            </div>
                            <div className="flex-1 rounded-lg bg-muted p-4 text-center">
                                <p className="text-2xl font-bold">50 days</p>
                                <p className="text-sm text-muted-foreground">
                                    Best Streak
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (Calendar spans 2 cols) */}
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

                {/* Full Width Lifetime Focus */}
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
                            <p className="text-sm text-muted-foreground">
                                Total Focus Time
                            </p>
                        </div>
                        <div className="flex-1 rounded-lg bg-muted p-4 text-center">
                            <p className="text-2xl font-bold">350</p>
                            <p className="text-sm text-muted-foreground">
                                Total Sessions
                            </p>
                        </div>
                        <div className="flex-1 rounded-lg bg-muted p-4 text-center">
                            <p className="text-2xl font-bold">50</p>
                            <p className="text-sm text-muted-foreground">Focus Days</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
