import Controls from '@/components/session/Controls';

import { ScrollArea } from '@/components/ui/scroll-area';

import { SessionGroupType, useSession } from '@/hooks/useSession';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import LoaderWrapper from '@/components/layouts/Loader';
import PageAnimation from '@/components/layouts/PageAnimation';
import SessionFilter from '@/components/session/SessionFilters';
import SessionGroup from '@/components/session/SessionGroup';
import TagModal from '@/components/tag/TagModal';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const Session = () => {
    const [groupBy, setGroupBy] = useState<SessionGroupType>('Date');
    const { data: groupedSessions, isLoading, error } = useSession({ groupBy });

    if (isLoading) return <LoaderWrapper />;
    if (error) return <div>Error: {error.toString()}</div>;

    return (
        <PageAnimation>
            <ScrollArea className="h-[var(--main-content-height)]">
                <div className="flex flex-col overflow-hidden p-2">
                    <div className="flex items-center justify-between pb-2 pe-2 box-border">
                        <Controls />
                        <div className="flex gap-2">
                            <SessionFilter
                                groupBy={groupBy}
                                setGroupBy={setGroupBy}
                            />
                            <TagModal />
                        </div>
                    </div>
                    <ScrollArea
                        className={cn(
                            location.pathname !== '/dashboard' &&
                                'max-sm:hidden',
                            'max-md:w-full',
                        )}
                    >
                        <ul className="flex flex-col gap-1 max-h-[var(--session-list-height)]">
                            {groupedSessions && groupedSessions.length > 0 ? (
                                groupedSessions.map((group, index) => (
                                    <li key={index}>
                                        <SessionGroup
                                            group={group}
                                            isFirst={index === 0}
                                        />
                                    </li>
                                ))
                            ) : (
                                <EmptySessionState />
                            )}
                        </ul>
                    </ScrollArea>
                </div>
            </ScrollArea>
        </PageAnimation>
    );
};

const EmptySessionState = () => {
    return (
        <div className="flex items-center justify-center h-full text-center mt-[15vh] bg-sidebar w-fit mx-auto p-10 shadow-lg border rounded-[5px]">
            <div className="max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-muted-foreground">
                    No session created yet
                </h2>

                <Accordion
                    type="single"
                    collapsible
                    className="w-full text-left min-w-[30vw]"
                >
                    <AccordionItem value="create-session">
                        <AccordionTrigger>Create a Session</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                            Click <b>“Add Session”</b> or <b>"Start"</b> to
                            start tracking your work.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="organize-session">
                        <AccordionTrigger>
                            Organize Your Sessions
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                            Sessions are grouped by <b>times intervals</b> and{' '}
                            <b>task</b>. This makes it easy to see how your time
                            is distributed and stay focused on the right work.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="review-session">
                        <AccordionTrigger>Review Time Spent</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                            All your session history is stored. Open the{' '}
                            <b>Statistics</b> section to review how much time
                            you’ve invested in projects.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
};

export default Session;
