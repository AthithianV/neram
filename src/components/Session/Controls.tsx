import { Pause, Play, PlusIcon, Square } from 'lucide-react';
import { Button } from '../ui/button';
import {
    usePauseTimer,
    useResumeTimer,
    useStopTimer,
    useTimer,
} from '@/hooks/useTimer';
import { Link } from 'react-router-dom';
import StartButton from './StartButton';
import { useUpdateSession } from '@/hooks/useSession';
import dayjs from 'dayjs';

const Controls = () => {
    const { data: timer } = useTimer();
    const { mutateAsync: updateSession } = useUpdateSession();
    const { mutate: stopTimer } = useStopTimer();
    const { mutateAsync: pauseTimer } = usePauseTimer();
    const { mutateAsync: resumeTimer } = useResumeTimer();

    if (!timer) return null;

    const handlePause = async () => {
        if (timer.session_id) {
            await updateSession({
                sessionToUpdate: {
                    session_duration_sec: timer.session_time_elapsed,
                },
                sessionId: timer.session_id,
            });
        }
        pauseTimer();
    };

    const handleResume = async () => {
        if (timer.session_id) {
            await updateSession({
                sessionToUpdate: {
                    break_duration_sec: timer.break_time_elapsed,
                },
                sessionId: timer.session_id,
            });
        }
        resumeTimer();
    };

    const handleStop = async () => {
        if (timer.session_id) {
            console.log({
                session_duration_sec: timer.session_time_elapsed,
                break_duration_sec: timer.break_time_elapsed,
                end_time: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
            });

            await updateSession({
                sessionToUpdate: {
                    session_duration_sec: timer.session_time_elapsed,
                    break_duration_sec: timer.break_time_elapsed,
                    end_time: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
                },
                sessionId: timer.session_id,
            });
        }
        stopTimer();
    };

    return (
        <div className="flex gap-2">
            {timer.is_session ? (
                <Button
                    variant={'default'}
                    className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 cursor-pointer"
                    onClick={handlePause}
                >
                    <Pause fill="currentColor" className="w-4 h-4" />
                    <span>Pause</span>
                </Button>
            ) : timer.is_break ? (
                <Button
                    variant={'default'}
                    className="flex items-center gap-1 bg-green-500 hover:bg-green-600 cursor-pointer"
                    onClick={handleResume}
                >
                    <Play fill="currentColor" className="w-4 h-4" />
                    <span>Resume</span>
                </Button>
            ) : (
                <StartButton />
            )}

            {timer.is_session ||
                (timer.is_break && (
                    <Button
                        variant={'default'}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 cursor-pointer"
                        onClick={handleStop}
                    >
                        <Square fill="currentColor" className="w-4 h-4" />
                        <span>Stop</span>
                    </Button>
                ))}

            <Link to="/session/add-session">
                <Button
                    variant={'default'}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 cursor-pointer"
                >
                    <PlusIcon fill="currentColor" className="w-4 h-4" />
                    <span>Add Session</span>
                </Button>
            </Link>
        </div>
    );
};

export default Controls;
