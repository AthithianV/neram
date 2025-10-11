import PageAnimation from '@/components/layouts/PageAnimation';
import PomodoroSettings from '@/components/pomodoro/PomodoroSettings';
import SessionsBar from '@/components/pomodoro/SessionBar';
import Timer from '@/components/pomodoro/Timer';

const Pomodoro = () => {
    return (
        <PageAnimation>
            <div className="p-10 h-[var(--main-content-height)] flex flex-col justify-between">
                <div className="flex justify-center items-center flex-col gap-5 w-full">
                    <Timer />
                    <SessionsBar />
                </div>
                <PomodoroSettings />
            </div>
        </PageAnimation>
    );
};

export default Pomodoro;
