import { usePauseTimer, useResumeTimer, useStopTimer, useTimer } from '@/hooks/useTimer';
import { Pause, Play, PlusIcon, Square } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';
import StartButton from './StartButton';

const Controls = () => {
    const [_, setSearchParams] = useSearchParams();

    const { data: timer } = useTimer();
    const { mutateAsync: stopTimer } = useStopTimer();
    const { mutateAsync: pauseTimer } = usePauseTimer();
    const { mutateAsync: resumeTimer } = useResumeTimer();

    if (!timer) return null;

    const handlePause = async () => {
        await pauseTimer();
    };

    const handleResume = async () => {
        await resumeTimer();
    };

    const handleStop = async () => {
        stopTimer();
    };

    return (
        <div className="flex gap-2">
            {timer.is_session && timer.timer_type !== 'Pomodoro' ? (
                <Button
                    variant={'default'}
                    className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 cursor-pointer"
                    onClick={handlePause}
                >
                    <Pause fill="currentColor" className="w-4 h-4" />
                    <span>Pause</span>
                </Button>
            ) : timer.is_break && timer.timer_type !== 'Pomodoro' ? (
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

            {(timer.is_session || timer.is_break) && timer.timer_type !== 'Pomodoro' && (
                <Button
                    variant={'default'}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 cursor-pointer"
                    onClick={handleStop}
                >
                    <Square fill="currentColor" className="w-4 h-4" />
                    <span>Stop</span>
                </Button>
            )}

            <Button
                variant={'default'}
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 cursor-pointer"
                onClick={() => setSearchParams({ modal: 'add_session' })}
            >
                <PlusIcon fill="currentColor" className="w-4 h-4" />
                <span>Add Session</span>
            </Button>
        </div>
    );
};

export default Controls;
