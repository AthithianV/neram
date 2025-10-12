import SessionCard from '@/components/session/SessionCard';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { usePomodoroSettings } from '@/hooks/usePomodoro';
import { GroupedSession } from '@/hooks/useSession';

import { useTimer } from '@/hooks/useTimer';

import { formatDuration } from '@/lib/time';
import { cn } from '@/lib/utils';

const SessionGroup = ({
    group,
    isFirst,
}: {
    group: GroupedSession;
    isFirst: boolean;
}) => {
    const { data: timer } = useTimer();
    const { data: pomodoroSettings } = usePomodoroSettings();

    return (
        <Accordion type="single" collapsible>
            <AccordionItem value={group.title}>
                <AccordionTrigger className="shadow p-4 border hover:underline-offset-0 flex-row-reverse bg-sidebar">
                    <div
                        className={cn(
                            'flex justify-between w-full font-bold text-md',
                            isFirst &&
                                timer &&
                                timer.is_running &&
                                'text-blue-500',
                        )}
                    >
                        <span>{group.title}</span>
                        <span>
                            {formatDuration(
                                group.total_duration_sec +
                                    (isFirst &&
                                    timer &&
                                    pomodoroSettings?.sync_with_time_tracking
                                        ? timer.session_time_elapsed
                                        : 0),
                            )}
                        </span>
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
