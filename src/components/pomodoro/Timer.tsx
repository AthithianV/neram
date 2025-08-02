import { usePomodoroSettings } from '@/hooks/usePomodoro';
import { useStartTimer, useStopTimer, useTimer } from '@/hooks/useTimer';
import { Play, Square } from 'lucide-react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import CircularProgress from './ProgressBar';

const Timer = () => {
    const { mutateAsync: startTimer } = useStartTimer();
    const { mutateAsync: stopTimer } = useStopTimer();
    const { data: timer } = useTimer();
    const { data: pomodoroSettings } = usePomodoroSettings();

    if (!timer || !pomodoroSettings) {
        return <Skeleton className="h-5" />;
    }

    return (
        <div className="flex flex-col gap-5">
            <CircularProgress
                totalDuration={pomodoroSettings.session_duration}
                currentDuration={timer.session_time_elapsed}
            />
            <div className="flex-center gap-3 my-2 text-2xl text-white">
                {!timer.is_session && !timer.is_break ? (
                    <Button
                        onClick={() => startTimer({})}
                        className="py-2 px-4 rounded bg-green-500 hover:bg-green-600"
                    >
                        <Play fill="currentColor" />
                    </Button>
                ) : (
                    <Button
                        className="py-2 px-4 rounded bg-red-500 hover:bg-red-600"
                        onClick={() => stopTimer()}
                    >
                        <Square fill="currentColor" />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Timer;
