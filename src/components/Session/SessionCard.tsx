import { formatTime } from '@/lib/time';
import { Badge } from '@/components/ui/badge';
import { SessionWithTaskAndTag, useDeleteSession } from '@/hooks/useSession';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { useState } from 'react';
import { Loader2, Trash } from 'lucide-react';
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

interface SessionCardProps {
    sessionWithTaskAndTag: SessionWithTaskAndTag;
}

const SessionCard = ({ sessionWithTaskAndTag }: SessionCardProps) => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const { session, task, tags } = sessionWithTaskAndTag;
    const [isHovered, setIsHovered] = useState(false);
    const { mutateAsync: deleteSession, isPending: isDeleting } =
        useDeleteSession();
    if (!task) {
        return null;
    }

    return (
        <li
            className={cn(
                'flex items-center justify-between',
                'p-3 border shadow rounded-md cursor-pointer',
                'bg-white',
                session.id === parseInt(sessionId || '0')
                    ? 'bg-gray-100'
                    : 'hover:bg-gray-50'
            )}
            onClick={() => {
                navigate(`update-session/${session.id}`);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center gap-4 flex-1">
                <div
                    className={cn('p-1 rounded-md bg-gray-50', 'h-12')}
                    style={
                        isHovered || session.id === parseInt(sessionId || '0')
                            ? {
                                  backgroundColor: task.color,
                              }
                            : {}
                    }
                ></div>
                <div className="flex flex-col gap-2 flex-1">
                    <h3 className="text-md font-semibold">
                        {task?.title || 'Untitled'}
                    </h3>
                    <ScrollArea className="max-w-5/6">
                        <ul className="flex gap-2">
                            {tags && tags.length > 0 ? (
                                tags.map((tag) => (
                                    <li
                                        key={tag.title}
                                        className="text-sm text-gray-500"
                                    >
                                        <Badge
                                            style={{
                                                backgroundColor: tag.color,
                                            }}
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
                    {formatTime(session.session_duration)}
                </p>

                {isHovered && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline">
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
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={async () => {
                                        await deleteSession(session.id);
                                    }}
                                    disabled={isDeleting}
                                    className="bg-red-500 hover:bg-red-600"
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
            </div>
        </li>
    );
};

export default SessionCard;
