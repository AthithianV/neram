import { useLocation } from 'react-router-dom';

import Controls from '@/components/session/Controls';
import SessionCard from '@/components/session/SessionCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { useSession } from '@/hooks/useSession';
import { useTimer } from '@/hooks/useTimer';

import { cn } from '@/lib/utils';

const Session = () => {
    const { data: sessions, isLoading, error } = useSession();
    const { data: timer } = useTimer();

    const location = useLocation();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.toString()}</div>;

    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            <div className="flex items-center justify-between h-1/12">
                <Controls />
            </div>
            <Separator className="mb-0" />
            <ScrollArea
                className={cn(
                    'h-11/12',
                    location.pathname !== '/dashboard' && 'max-sm:hidden',
                    'max-md:w-full',
                )}
            >
                <ul className="flex flex-col py-2">
                    {sessions && sessions.length > 0 ? (
                        sessions.map((sessionWithTaskAndTag, index) => (
                            <SessionCard
                                key={index}
                                sessionWithTaskAndTag={sessionWithTaskAndTag}
                                timer={
                                    timer && timer.session_id === sessionWithTaskAndTag.id
                                        ? timer
                                        : null
                                }
                            />
                        ))
                    ) : (
                        <h1 className="font-semibold text-center my-2 text-gray-500 text-sm">
                            {' '}
                            No Session to Display
                        </h1>
                    )}
                </ul>
            </ScrollArea>
        </div>
    );
};

export default Session;
