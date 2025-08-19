import DailySummary from '@/components/dashboard/DailySummary';
import LifeTimeSummary from '@/components/dashboard/LifeTimeSummary';
import MonthlySummary from '@/components/dashboard/MonthlySummary';
import Streak from '@/components/dashboard/Streak';

const Dashboard = () => {
    return (
        <div className="bg-background p-2 text-foreground">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="flex flex-col gap-3">
                    <DailySummary />
                    <Streak />
                    <LifeTimeSummary />
                </div>
                <MonthlySummary />
            </div>
        </div>
    );
};

export default Dashboard;
