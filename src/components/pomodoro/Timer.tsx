import {
    usePomodoroSettings,
    useUpdatePomodoroSettings,
} from '@/hooks/usePomodoro';
import {
    usePauseTimer,
    useResumeTimer,
    useStartTimer,
    useStopTimer,
    useTimer,
} from '@/hooks/useTimer';
import { Play, Square } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import CircularProgress from './ProgressBar';
import { playSound, systemNotiFication } from '@/helpers/notification';
import { toast } from 'react-toastify';
import {
    BREAK_END_SOUND_PATH,
    SESSION_END_SOUND_PATH,
    SESSION_START_SOUND_PATH,
} from '@/constants/notification';

const Timer = () => {
    const { mutateAsync: startTimer } = useStartTimer();
    const { mutateAsync: stopTimer } = useStopTimer();
    const { mutateAsync: pauseTimer } = usePauseTimer();
    const { mutateAsync: resumeTimer } = useResumeTimer();
    const { mutateAsync: updatePomodoro } = useUpdatePomodoroSettings();
    const { data: timer } = useTimer();
    const { data: pomodoroSettings } = usePomodoroSettings();

    // ✅ Tracks whether the current session/break has already been handled
    const handledPhaseRef = useRef<'session' | 'break' | null>(null);

    const stopPomodoro = () => {
        stopTimer();
        updatePomodoro({ session_completed: 0, break_completed: 0 });
        handledPhaseRef.current = null;
    };

    // ✅ Reset phase when mode changes (new session/break started)
    useEffect(() => {
        if (!timer) return;
        // whenever timer changes mode, reset phase tracking
        handledPhaseRef.current = null;
    }, [timer?.is_session, timer?.is_break, timer?.timer_type]);

    useEffect(() => {
        if (!timer || !pomodoroSettings) return;

        const {
            session_completed,
            break_completed,
            break_duration,
            session_duration,
            session_count,
            notification_sound,
        } = pomodoroSettings;
        const { is_session, is_break } = timer;

        const handleTimer = async () => {
            try {
                // stop when all sessions completed
                if (session_count <= session_completed) {
                    stopPomodoro();
                    return;
                }

                // ✅ Handle session end — only once
                if (is_session && timer.timer === session_duration) {
                    if (handledPhaseRef.current === 'session') return;
                    handledPhaseRef.current = 'session';

                    await pauseTimer();
                    await updatePomodoro({
                        session_completed: session_completed + 1,
                    });

                    await systemNotiFication(
                        'Session Completed',
                        `Session ${session_completed + 1} completed. Take a break ☕`,
                    );
                    if (notification_sound) playSound(SESSION_END_SOUND_PATH);
                    return;
                }

                // ✅ Handle break end — only once
                if (is_break && timer.timer === break_duration) {
                    if (handledPhaseRef.current === 'break') return;
                    handledPhaseRef.current = 'break';

                    await resumeTimer();
                    await updatePomodoro({
                        break_completed: break_completed + 1,
                    });

                    await systemNotiFication(
                        'Break Completed',
                        `Break ${break_completed + 1} completed. Back to work 💪`,
                    );
                    if (notification_sound) playSound(BREAK_END_SOUND_PATH);
                }
            } catch (e) {
                console.error(e);
            }
        };

        handleTimer();
    }, [timer, pomodoroSettings]);

    if (!timer || !pomodoroSettings) {
        return <Skeleton className="h-5" />;
    }

    const handleStart = async () => {
        const shouldSync = pomodoroSettings.sync_with_time_tracking;
        const projectId = pomodoroSettings.default_project;
        const notification_sound = pomodoroSettings.notification_sound;

        if (shouldSync && !projectId) {
            toast.error(
                'Sync with time tracking is turned on. Please choose a project to start Pomodoro.',
                {
                    position: 'bottom-center',
                    hideProgressBar: true,
                },
            );
            return;
        }

        await startTimer({
            timerData: {
                timerType: 'Pomodoro',
                projectId: projectId ?? undefined,
            },
            sessionData: { title: 'Session Initiated by Pomodoro' },
            shouldCreateSession: shouldSync,
        });

        if (notification_sound) playSound(SESSION_START_SOUND_PATH);
    };

    return (
        <div className="flex flex-col gap-5">
            <CircularProgress
                totalDuration={
                    timer.is_break
                        ? pomodoroSettings.break_duration
                        : pomodoroSettings.session_duration
                }
                currentDuration={
                    timer.timer_type === 'Pomodoro' ? timer.timer : 0
                }
            />
            <div className="flex-center gap-3 my-2 text-2xl">
                {(!timer.is_session && !timer.is_break) ||
                timer.timer_type !== 'Pomodoro' ? (
                    <Button
                        onClick={handleStart}
                        className="py-2 px-4 rounded bg-green-500 hover:bg-green-600 text-white"
                        disabled={
                            timer.timer > 0 && timer.timer_type !== 'Pomodoro'
                        }
                    >
                        <Play fill="currentColor" />
                    </Button>
                ) : (
                    <Button
                        className="py-2 px-4 rounded bg-red-500 hover:bg-red-600 text-white"
                        onClick={stopPomodoro}
                    >
                        <Square fill="currentColor" />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Timer;
