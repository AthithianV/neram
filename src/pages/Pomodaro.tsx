import PageAnimation from '@/components/layouts/PageAnimation';
import SessionsBar from '@/components/pomodoro/SessionBar';
import Timer from '@/components/pomodoro/Timer';

const Pomodoro = () => {
    return (
        <PageAnimation>
            <div className="p-10">
                <div className="flex justify-center items-center flex-col gap-5 w-full">
                    <Timer />
                    <SessionsBar />
                </div>
            </div>
        </PageAnimation>
    );
};

export default Pomodoro;
