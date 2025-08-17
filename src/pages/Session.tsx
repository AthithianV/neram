import Controls from '@/components/session/Controls';

import { ScrollArea } from '@/components/ui/scroll-area';

import { useSession } from '@/hooks/useSession';

import LoaderWrapper from '@/components/layouts/Loader';
import PageAnimation from '@/components/layouts/PageAnimation';
import SessionGroup from '@/components/session/SessionGroup';
import { cn } from '@/lib/utils';

const Session = () => {
    const { data: groupedSessions, isLoading, error } = useSession({ groupBy: 'Date' });

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
                    <ul className="flex flex-col gap-1 max-h-[var(--session-list-height)] pe-4">
                        {groupedSessions && groupedSessions.length > 0 ? (
                            groupedSessions.map((group, index) => (
                                <li key={index}>
                                    <SessionGroup group={group} />
                                </li>
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
