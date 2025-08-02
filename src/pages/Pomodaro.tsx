import SessionsBar from '@/components/pomodoro/SessionBar';
import Timer from '@/components/pomodoro/Timer';

const Pomodoro = () => {
    return (
        <div className="h-full flex-col relative slide-up z-0">
            <div className="flex-center flex-col w-full">
                <Timer />
                <SessionsBar />
            </div>
        </div>
    );
};

export default Pomodoro;
