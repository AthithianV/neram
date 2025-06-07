import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import useWorkunitStore from '@/store/WorkunitStore';
import WorkunitCard from '@/components/workunit/WorkunitCard';
import { WorkunitSheet } from '@/components/workunit/WorkunitForm';
import { PlayIcon, PauseIcon, PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Workunit } from '@/schema/WorkunitSchema';
import { useWorkunit } from '@/hooks/useWorkunit';

const Dashboard = () => {
    const { addWorkunit, setTimer } = useWorkunitStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [currentWorkunit, setCurrentWorkunit] = useState<Workunit | null>(
        null
    );
    const { data: workunits, isLoading, error } = useWorkunit();

    useEffect(() => {
        console.log(workunits);
    }, [workunits]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.toString()}</div>;
    }

    const handlePlay = () => {
        const workunit = {
            id: Date.now(),
            startTime: new Date(),
            endTime: new Date(),
            task: 'Workunit 1',
            date: new Date(),
            sessionDuration: 0,
            breakDuration: 0,
            tags: [],
        };
        if (isPlaying) {
            setIsPlaying(false);
            if (intervalId) {
                clearInterval(intervalId);
            }
        } else {
            addWorkunit(workunit);
            setCurrentWorkunit(workunit);
            setIsPlaying(true);
            const interval = setInterval(() => {
                setTimer(1, workunit.id);
            }, 1000);
            setIntervalId(interval);
        }
    };

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between h-1/12">
                <div className="flex gap-2">
                    <Button
                        variant={'default'}
                        className="flex items-center gap-1"
                        onClick={handlePlay}
                    >
                        {isPlaying ? (
                            <PauseIcon
                                fill="currentColor"
                                className="w-4 h-4"
                            />
                        ) : (
                            <PlayIcon fill="currentColor" className="w-4 h-4" />
                        )}
                        <span>Start</span>
                    </Button>
                    <WorkunitSheet>
                        <Button
                            variant={'default'}
                            className="flex items-center gap-1"
                        >
                            <PlusIcon fill="currentColor" className="w-4 h-4" />
                            <span>Add Work Unit</span>
                        </Button>
                    </WorkunitSheet>
                </div>
                <div></div>
            </div>

            <ScrollArea className="h-11/12 border-t-2 pt-2">
                <ul className="flex flex-col gap-[1px]">
                    {workunits &&
                        workunits.length > 0 &&
                        workunits.map((workunit: Workunit) => (
                            <WorkunitSheet
                                key={workunit.id}
                                defaultValue={workunit}
                            >
                                <WorkunitCard workunit={workunit} />
                            </WorkunitSheet>
                        ))}
                </ul>
            </ScrollArea>
        </div>
    );
};

export default Dashboard;
