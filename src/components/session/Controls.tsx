import { usePauseTimer, useResumeTimer, useStopTimer, useTimer } from '@/hooks/useTimer';
import { cn } from '@/lib/utils';
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
                    className={cn(
                        ' bg-yellow-500 hover:bg-yellow-600',
                        ' dark:bg-yellow-800 dark:hover:bg-yellow-800',
                    )}
                    onClick={handlePause}
                >
                    <Pause fill="currentColor" className="w-4 h-4" />
                    <span>Pause</span>
                </Button>
            ) : timer.is_break && timer.timer_type !== 'Pomodoro' ? (
                <Button
                    variant={'default'}
                    className={cn(
                        'bg-green-500 hover:bg-green-600 ',
                        'dark:bg-green-800 dark:hover:bg-green-900 ',
                        'cursor-pointer text-white',
                    )}
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
                    className={cn(
                        ' bg-red-500 hover:bg-red-600 ',
                        ' dark:bg-red-700 dark:hover:bg-red-800 ',
                        'text-white',
                    )}
                    onClick={handleStop}
                >
                    <Square fill="currentColor" className="w-4 h-4" />
                    <span>Stop</span>
                </Button>
            )}

            <Button
                variant={'default'}
                className={cn(
                    'bg-blue-500 hover:bg-blue-600',
                    'dark:bg-blue-800 dark:hover:bg-blue-900',
                    'text-white',
                )}
                onClick={() => setSearchParams({ modal: 'add_session' })}
            >
                <PlusIcon fill="currentColor" className="w-4 h-4" />
                <span>Add Session</span>
            </Button>
        </div>
    );
};

export default Controls;
