import { Pause, Play, PlusIcon, Square } from 'lucide-react';
import { Button } from '../ui/button';
import { useStartTimer, useStopTimer, useTimer } from '@/hooks/useTImer';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const Controls = () => {
    const { data: timer, error } = useTimer();
    const { mutate: startTimer } = useStartTimer();
    const { mutate: stopTimer } = useStopTimer();

    useEffect(() => {
        console.log(timer);
    }, [timer]);

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
                <Button
                    variant={'default'}
                    className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600"
                    onClick={() => startTimer('Session')}
                >
                    <Play fill="currentColor" className="w-4 h-4" />
                    <span>Start</span>
                </Button>
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

            <Link to="/dashboard/add-workunit">
                <Button
                    variant={'default'}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 "
                >
                    <PlusIcon fill="currentColor" className="w-4 h-4" />
                    <span>Add Work Unit</span>
                </Button>
            </Link>
        </div>
    );
};

export default Controls;
