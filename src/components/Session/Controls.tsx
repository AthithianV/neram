import { Pause, PlusIcon, Square } from 'lucide-react';
import { Button } from '../ui/button';
import { useStartTimer, useStopTimer, useTimer } from '@/hooks/useTimer';
import { Link } from 'react-router-dom';
import StartButton from './StartButton';

const Controls = () => {
    const { data: timer } = useTimer();
    const { mutate: startTimer } = useStartTimer();
    const { mutate: stopTimer } = useStopTimer();

    if (!timer) return null;

    return (
        <div className="flex gap-2">
            {timer.is_running && timer.timer_type === 'Session' ? (
                <Button
                    variant={'default'}
                    className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600"
                    onClick={() => startTimer('Break')}
                >
                    <Pause fill="currentColor" className="w-4 h-4" />
                    <span>Pause</span>
                </Button>
            ) : (
                <StartButton />
            )}

            {timer.is_running && timer.timer_type === 'Session' && (
                <Button
                    variant={'default'}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600"
                    onClick={() => stopTimer()}
                >
                    <Square fill="currentColor" className="w-4 h-4" />
                    <span>Stop</span>
                </Button>
            )}

            {timer.timer_type === 'Session' && timer.time}

            <Link to="/session/add-session">
                <Button
                    variant={'default'}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 "
                >
                    <PlusIcon fill="currentColor" className="w-4 h-4" />
                    <span>Add Session</span>
                </Button>
            </Link>
        </div>
    );
};

export default Controls;
