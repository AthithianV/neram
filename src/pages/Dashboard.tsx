import DailySummary from '@/components/dashboard/DailySummary';
import LifeTimeSummary from '@/components/dashboard/LifeTimeSummary';
import MonthlySummary from '@/components/dashboard/MonthlySummary';
import Streak from '@/components/dashboard/Streak';
import { ScrollArea } from '@/components/ui/scroll-area';

const Dashboard = () => {
    return (
        <ScrollArea>
            <div className="bg-background p-2 text-foreground max-h-[var(--main-content-height)]">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-3">
                        <DailySummary />
                        <Streak />
                        <LifeTimeSummary />
                    </div>
                    <MonthlySummary />
                </div>
            </div>
        </ScrollArea>
    );
};

export default Dashboard;
