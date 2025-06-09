import { Link, Play, PlayIcon, PlusIcon, Square } from 'lucide-react';
import { Button } from '../ui/button';
import { useStartTimer, useStopTimer, useTimer } from '@/hooks/useTImer';

const Controls = () => {
    const { data: timer } = useTimer();
    const { mutate: startTimer } = useStartTimer();
    const { mutate: stopTimer } = useStopTimer();

    return (
        <div className="flex gap-2">
            {timer?.isRunning ? (
                <Button
                    variant={'default'}
                    className="flex items-center gap-1 bg-gold-500 hover:bg-gold-600"
                    onClick={() => startTimer('break')}
                >
                    <Play fill="currentColor" className="w-4 h-4" />
                    <span>Stop</span>
                </Button>
            ) : (
                <Button
                    variant={'default'}
                    className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600"
                    onClick={() => startTimer('session')}
                >
                    <PlayIcon fill="currentColor" className="w-4 h-4" />
                    <span>Start</span>
                </Button>
            )}

            {timer?.isRunning && (
                <Button
                    variant={'default'}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600"
                    onClick={() => stopTimer()}
                >
                    <Square fill="currentColor" className="w-4 h-4" />
                    <span>Stop</span>
                </Button>
            )}

            <Link to="/dashboard/add-workunit">
                <Button
                    variant={'default'}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600"
                >
                    <PlusIcon fill="currentColor" className="w-4 h-4" />
                    <span>Add Work Unit</span>
                </Button>
            </Link>
        </div>
    );
};

export default Controls;
