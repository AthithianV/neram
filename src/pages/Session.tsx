import Controls from '@/components/session/Controls';
import SessionCard from '@/components/session/SessionCard';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useSession } from '@/hooks/useSession';
import { useTimer } from '@/hooks/useTimer';

import LoaderWrapper from '@/components/layouts/Loader';
import PageAnimation from '@/components/layouts/PageAnimation';
import { cn } from '@/lib/utils';

const Session = () => {
    const { data: sessions, isLoading, error } = useSession();
    const { data: timer } = useTimer();

    if (isLoading) return <LoaderWrapper />;
    if (error) return <div>Error: {error.toString()}</div>;

    return (
        <PageAnimation>
            <div className="flex flex-col overflow-hidden p-2">
                <div className="flex items-center justify-between pb-2 box-border">
                    <Controls />
                </div>
                <ScrollArea
                    className={cn(
                        location.pathname !== '/dashboard' && 'max-sm:hidden',
                        'max-md:w-full',
                    )}
                >
                    <ul className="flex flex-col max-h-[var(--session-list-height)]">
                        {sessions && sessions.length > 0 ? (
                            sessions.map((sessionWithTaskAndTag, index) => (
                                <SessionCard
                                    key={index}
                                    sessionWithTaskAndTag={sessionWithTaskAndTag}
                                    timer={
                                        timer &&
                                        timer.session_id === sessionWithTaskAndTag.id
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
        </PageAnimation>
    );
};

export default Session;
