import { Badge } from '@/components/ui/badge';
import { SessionType, useDeleteSession } from '@/hooks/useSession';
import { TimerResponse } from '@/hooks/useTimer';
import { formatDuration, makeTimeDisplay } from '@/lib/time';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { Clock9, Coffee, Loader2, Trash } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

interface SessionCardProps {
    sessionWithTaskAndTag: SessionType;
    timer: TimerResponse | null;
}

const SessionCard = ({ sessionWithTaskAndTag, timer }: SessionCardProps) => {
    const [_, setSearchParams] = useSearchParams();
    const { id, title, project, tags, session_duration_sec, start_time, end_time, date } =
        sessionWithTaskAndTag;

    const [isHovered, setIsHovered] = useState(false);

    return (
        <li
            onClick={() => {
                setSearchParams({ modal: 'edit_session', id: id.toString() });
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card className="py-4 px-0 rounded-sm my-[1px]">
                <CardContent
                    className={cn(
                        'flex items-center justify-between w-full',
                        'py-0 px-0 pe-5',
                    )}
                >
                    <div className="flex items-center gap-4 flex-1">
                        <div
                            className={cn('px-[0.2rem] rounded-e-md', 'h-14')}
                            style={{
                                backgroundColor: project.color,
                            }}
                        ></div>
                        <div className="flex flex-col gap-2 flex-1">
                            <h3 className="text-sm font-semibold">
                                {title || 'Untitled'}
                            </h3>
                            <ScrollArea className="max-w-5/6">
                                <ul className="flex gap-2">
                                    {tags && tags.length > 0 ? (
                                        tags.map((tag) => (
                                            <li key={tag.title}>
                                                <Badge
                                                    style={{
                                                        backgroundColor: tag.color,
                                                    }}
                                                    className="text-[0.6rem] px-2 rounded-[0.3rem]"
                                                >
                                                    {tag.title}
                                                </Badge>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-sm text-gray-500 opacity-40">
                                            <Badge className="bg-gray-200 text-gray-500">
                                                No tags
                                            </Badge>
                                        </li>
                                    )}
                                </ul>
                                <ScrollBar orientation="horizontal" hidden />
                            </ScrollArea>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1 text-sm flex-col items-end">
                            <span
                                className={cn(
                                    'font-semibold',
                                    timer && timer.session_id === id
                                        ? 'text-blue-500'
                                        : '',
                                )}
                            >
                                {formatDuration(
                                    timer && timer.session_id === id
                                        ? timer.session_time_elapsed
                                        : session_duration_sec,
                                )}
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-col items-end">
                                <span>{date && dayjs(date).format('DD MMM YYYY')} </span>
                                <span>
                                    {makeTimeDisplay(start_time)} -{' '}
                                    {end_time ? makeTimeDisplay(end_time) : 'Now'}
                                </span>
                            </div>
                        </div>

                        <SessionCard.DELETE
                            show={isHovered && timer?.session_id !== id}
                            sessionId={id}
                        />

                        {timer &&
                            timer.session_id === id &&
                            (timer.is_session ? (
                                <Clock9 className="h-4 text-blue-400" />
                            ) : (
                                <Coffee className="h-4 text-blue-500" />
                            ))}
                    </div>
                </CardContent>
            </Card>
        </li>
    );
};

SessionCard.DELETE = ({ show, sessionId }: { show: boolean; sessionId: number }) => {
    const navigate = useNavigate();
    const { mutateAsync: deleteSession, isPending: isDeleting } = useDeleteSession();
    return (
        show && (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="ghost"
                        onClick={(e) => e.stopPropagation()}
                        className="cursor-pointer"
                    >
                        <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete this session?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete
                            this session.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            className="cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async (e) => {
                                e.stopPropagation();
                                sessionId && (await deleteSession(sessionId));
                                navigate('/session');
                            }}
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600 cursor-pointer"
                        >
                            {isDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                'Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    );
};

export default React.memo(SessionCard, (prev, next) => {
    return (
        prev.sessionWithTaskAndTag === next.sessionWithTaskAndTag &&
        prev.timer?.session_time_elapsed === next.timer?.session_time_elapsed
    );
});
