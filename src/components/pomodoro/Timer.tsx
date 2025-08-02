import { usePomodoroSettings, useUpdatePomodoroSettings } from '@/hooks/usePomodoro';
import {
    usePauseTimer,
    useResumeTimer,
    useStartTimer,
    useStopTimer,
    useTimer,
} from '@/hooks/useTimer';
import { Play, Square } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import CircularProgress from './ProgressBar';

const Timer = () => {
    const { mutateAsync: startTimer } = useStartTimer();
    const { mutateAsync: stopTimer } = useStopTimer();
    const { mutateAsync: pauseTimer } = usePauseTimer();
    const { mutateAsync: resumeTimer } = useResumeTimer();
    const { mutateAsync: updatePomodoro } = useUpdatePomodoroSettings();
    const { data: timer } = useTimer();
    const { data: pomodoroSettings } = usePomodoroSettings();

    const stopPomodoro = () => {
        stopTimer();
        updatePomodoro({ session_completed: 0, break_completed: 0 });
    };

    useEffect(() => {
        if (!timer || !pomodoroSettings) {
            return;
        }

        const handleTimer = async () => {
            const {
                session_completed,
                break_completed,
                break_duration,
                session_duration,
                session_count,
            } = pomodoroSettings;
            const { is_session, is_break } = timer;

            if (session_count <= session_completed) {
                stopPomodoro();
                return;
            }

            if (is_session && timer.timer === session_duration) {
                await pauseTimer();
                await updatePomodoro({ session_completed: session_completed + 1 });
                return;
            }

            if (is_break && timer.timer === break_duration) {
                await resumeTimer();
                await updatePomodoro({ break_completed: break_completed + 1 });
            }
        };
        handleTimer();
    }, [timer, pomodoroSettings]);

    if (!timer || !pomodoroSettings) {
        return <Skeleton className="h-5" />;
    }

    return (
        <div className="flex flex-col gap-5">
            <CircularProgress
                totalDuration={
                    timer.is_break
                        ? pomodoroSettings.break_duration
                        : pomodoroSettings.session_duration
                }
                currentDuration={timer.timer_type === 'Pomodoro' ? timer.timer : 0}
            />
            <div className="flex-center gap-3 my-2 text-2xl text-white">
                {(!timer.is_session && !timer.is_break) ||
                timer.timer_type !== 'Pomodoro' ? (
                    <Button
                        onClick={() => startTimer({ timerType: 'Pomodoro' })}
                        className="py-2 px-4 rounded bg-green-500 hover:bg-green-600"
                        disabled={timer.timer > 0 && timer.timer_type !== 'Pomodoro'}
                    >
                        <Play fill="currentColor" />
                    </Button>
                ) : (
                    <Button
                        className="py-2 px-4 rounded bg-red-500 hover:bg-red-600"
                        onClick={() => stopPomodoro()}
                    >
                        <Square fill="currentColor" />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Timer;
