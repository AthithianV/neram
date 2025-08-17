import Controls from '@/components/session/Controls';

import { ScrollArea } from '@/components/ui/scroll-area';

import { SessionGroupType, useSession } from '@/hooks/useSession';

import LoaderWrapper from '@/components/layouts/Loader';
import PageAnimation from '@/components/layouts/PageAnimation';
import SessionFilter from '@/components/session/SessionFilters';
import SessionGroup from '@/components/session/SessionGroup';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const Session = () => {
    const [groupBy, setGroupBy] = useState<SessionGroupType>('Date');
    const { data: groupedSessions, isLoading, error } = useSession({ groupBy });

    if (isLoading) return <LoaderWrapper />;
    if (error) return <div>Error: {error.toString()}</div>;

    return (
        <PageAnimation>
            <div className="flex flex-col overflow-hidden p-2">
                <div className="flex items-center justify-between pb-2 pe-2 box-border">
                    <Controls />
                    <SessionFilter groupBy={groupBy} setGroupBy={setGroupBy} />
                </div>
                <ScrollArea
                    className={cn(
                        location.pathname !== '/dashboard' && 'max-sm:hidden',
                        'max-md:w-full',
                    )}
                >
                    <ul className="flex flex-col gap-1 max-h-[var(--session-list-height)]">
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
