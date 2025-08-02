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

    const calculateTime = (count: number, totalElapsed: number, duration: number) => {
        return totalElapsed - count * duration;
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
            const { is_session, is_break, session_time_elapsed, break_time_elapsed } =
                timer;

            if (session_count <= session_completed) {
                stopPomodoro();
                return;
            }

            if (
                is_session &&
                calculateTime(
                    session_completed,
                    session_time_elapsed,
                    session_duration,
                ) === session_duration
            ) {
                await pauseTimer();
                await updatePomodoro({ session_completed: session_completed + 1 });
                return;
            }

            if (
                is_break &&
                calculateTime(break_completed, break_time_elapsed, break_duration) ===
                    break_duration
            ) {
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
                currentDuration={
                    timer.is_break
                        ? calculateTime(
                              pomodoroSettings.break_completed,
                              timer.break_time_elapsed,
                              pomodoroSettings.break_duration,
                          )
                        : calculateTime(
                              pomodoroSettings.session_completed,
                              timer.session_time_elapsed,
                              pomodoroSettings.session_duration,
                          )
                }
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
