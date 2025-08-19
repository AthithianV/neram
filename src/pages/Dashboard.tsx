import DailySummary from '@/components/dashboard/DailySummary';
import LifeTimeSummary from '@/components/dashboard/LifeTimeSummary';
import MonthlySummary from '@/components/dashboard/MonthlySummary';
import Streak from '@/components/dashboard/Streak';

const Dashboard = () => {
    return (
        <div className="bg-background p-2 text-foreground">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="flex flex-col gap-6">
                    <DailySummary />
                    <Streak />
                </div>
                <MonthlySummary />
                <LifeTimeSummary />
            </div>
        </div>
    );
};

export default Dashboard;
