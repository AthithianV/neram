import { formatDuration } from '@/lib/time';
import { Badge } from '@/components/ui/badge';
import { SessionType, useDeleteSession } from '@/hooks/useSession';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { useState } from 'react';
import { Clock9, Coffee, Loader2, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '../ui/alert-dialog';
import { useTimer } from '@/hooks/useTimer';

interface SessionCardProps {
    sessionWithTaskAndTag: SessionType;
}

const SessionCard = ({ sessionWithTaskAndTag }: SessionCardProps) => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const { id, title, project, tags, session_duration_sec } =
        sessionWithTaskAndTag;
    const [isHovered, setIsHovered] = useState(false);
    const { mutateAsync: deleteSession, isPending: isDeleting } =
        useDeleteSession();

    const { data: timer } = useTimer();

    return (
        <li
            className={cn(
                'flex items-center justify-between',
                'py-3 pe-3 border shadow rounded-md cursor-pointer',
                'bg-white',
                id === parseInt(sessionId || '0')
                    ? 'bg-blue-300'
                    : 'hover:bg-gray-50',
            )}
            onClick={() => {
                navigate(`update-session/${id}`);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center gap-4 flex-1">
                <div
                    className={cn(
                        'px-[0.2rem] rounded-e-md bg-gray-50',
                        'h-14',
                    )}
                    style={{
                        backgroundColor: project.color,
                    }}
                ></div>
                <div className="flex flex-col gap-2 flex-1">
                    <h3 className="text-md font-semibold">
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
                <p className="text-sm text-gray-500">
                    {formatDuration(
                        timer && timer.session_id === id
                            ? timer.session_time_elapsed
                            : session_duration_sec,
                    )}
                </p>

                {isHovered && timer && timer.session_id !== id && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                onClick={(e) => e.stopPropagation()}
                                className="cursor-pointer"
                            >
                                <Trash className="w-4 h-4 text-red-500" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you sure you want to delete this
                                    session?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete this session.
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
                                        id && (await deleteSession(id));
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
                )}

                {timer &&
                    timer.session_id === id &&
                    (timer.is_session ? <Clock9 /> : <Coffee />)}
            </div>
        </li>
    );
};

export default SessionCard;
