import SessionCard from '@/components/session/SessionCard';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { GroupedSession } from '@/hooks/useSession';

import { useTimer } from '@/hooks/useTimer';

import { formatDuration } from '@/lib/time';

const SessionGroup = ({ group }: { group: GroupedSession }) => {
    const { data: timer } = useTimer();

    return (
        <Accordion type="single" collapsible>
            <AccordionItem value={group.title}>
                <AccordionTrigger className="shadow p-4 border hover:underline-offset-0">
                    <div className="flex justify-between w-full font-bold text-md">
                        <span>{group.title}</span>
                        <span>{formatDuration(group.total_duration_sec)}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                    <ul className="ps-2">
                        {group.sessions.map((session, index) => (
                            <SessionCard
                                key={index}
                                sessionWithTaskAndTag={session}
                                timer={
                                    timer && timer.session_id === session.id
                                        ? timer
                                        : null
                                }
                            />
                        ))}
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default SessionGroup;
