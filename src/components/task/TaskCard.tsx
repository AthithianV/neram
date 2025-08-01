import { TASK_PRIORITY_COLOR, TaskPriority } from '@/constants/task';
import { ReadTask } from '@/hooks/useTask';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { AlarmCheck, Calendar, Flame, Trash2 } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import DeleteTask from './DeleteTask';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

type PropType = { task: ReadTask; isDragged?: boolean };

const TaskCard = ({ task, isDragged }: PropType) => {
    const [_, setSearchParams] = useSearchParams();
    const [isHovered, setIsHovered] = useState(false);
    const [isHeaderHovered, setIsHeaderHovered] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: task.id,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const getPriorityStyle = (priority?: string | null) => {
        const color = TASK_PRIORITY_COLOR[(priority as TaskPriority) ?? 'Default'];
        return { color };
    };

    const getOpacity = () => {
        const { status } = task;
        return status === 'Completed' || status === 'Cancelled' || isDragged
            ? 'opacity-50'
            : '';
    };

    const formatDeadLine = (deadline: string): string => {
        const date = dayjs(deadline);
        return date.isBefore(dayjs()) ? date.fromNow() : date.toNow(true);
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card
                className={cn(
                    'transition-all hover:shadow-md rounded-md gap-0 py-3 px-2 w-full z-800',
                    'cursor-pointer',
                    getOpacity(),
                    isHeaderHovered ? 'border-2 border-sky-500' : '',
                )}
                onClick={() =>
                    setSearchParams({
                        task_status: task.status,
                        modal: 'edit_task',
                        id: String(task.id),
                    })
                }
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                draggable
            >
                <CardHeader className="px-2">
                    <div className="flex items-center justify-between gap-2">
                        <CardTitle
                            className="text-sm font-semibold cursor-grab"
                            {...attributes}
                            {...listeners}
                            onClick={(e) => e.stopPropagation()}
                            onMouseEnter={() => setIsHeaderHovered(true)}
                            onMouseLeave={() => setIsHeaderHovered(false)}
                        >
                            {task.title}
                        </CardTitle>
                        <Button
                            variant="ghost"
                            className={cn(
                                isHovered ? 'opacity-100' : 'opacity-0',
                                'transition ease-in-out delay-10',
                                'text-red-500 !h-6 hover:bg-transparent hover:text-red-600',
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenDeleteModal(true);
                            }}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="space-y-2 px-2">
                    {/* {task.description && (
                        <div
                            className="w-full text-wrap text-xs text-muted-foreground line-clamp-2"
                            dangerouslySetInnerHTML={{
                                __html: task.description,
                            }}
                        />
                    )} */}

                    <div className="flex gap-1 flex-wrap item-center">
                        <TaskAttribute
                            title="Deadline"
                            text={task.deadline ? formatDeadLine(task.deadline) : null}
                            icon={<Calendar />}
                            className={
                                dayjs(task.deadline).isBefore(dayjs())
                                    ? 'text-red-500'
                                    : 'text-blue-600'
                            }
                        />

                        <TaskAttribute
                            title="Estimated Time"
                            text={
                                task.estimated_time !== 0 && task.estimated_time
                                    ? `${(task.estimated_time / 3600).toFixed(0)} h`
                                    : null
                            }
                            icon={<AlarmCheck className="h-4 w-4" />}
                        />

                        {task.priority && (
                            <TaskAttribute
                                title="Priority"
                                text={task.priority}
                                icon={<Flame fill="currentColor" />}
                                style={getPriorityStyle(task.priority)}
                                className="text-white border-none px-0"
                            />
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-1">
                        <Tooltip>
                            <TooltipTrigger>
                                <span className="text-muted-foreground text-xs font-semibold">
                                    {task.started_at &&
                                        dayjs(task.started_at).format('DD MMM YYYY')}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>Started At</TooltipContent>
                        </Tooltip>

                        {task.completed_at && (
                            <Tooltip>
                                <TooltipTrigger>
                                    <span className="text-muted-foreground text-xs font-semibold">
                                        {dayjs(task.completed_at).format('DD MMM YYYY')}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>Completed At</TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                </CardContent>
            </Card>
            <DeleteTask
                taskId={task.id}
                isAlertOpen={openDeleteModal}
                setAlertOpen={setOpenDeleteModal}
            />
        </div>
    );
};

const TaskAttribute = ({
    title,
    text,
    icon,
    className,
    style,
}: {
    title: string;
    text: string | null;
    icon: ReactNode;
    className?: string;
    style?: { color: string };
}) => {
    return (
        <Tooltip>
            <TooltipTrigger>
                <Badge
                    className={cn(
                        'flex items-center justify-between',
                        'bg-transparent text-gray-700 border-gray-200',
                        'text-xs py-1',
                        'font-semibold',
                        'rounded-sm gap-[2px] h-full',
                        className ?? '',
                    )}
                    style={style}
                >
                    {icon}
                    {text && <span>{text}</span>}
                </Badge>
            </TooltipTrigger>
            <TooltipContent>{title}</TooltipContent>
        </Tooltip>
    );
};

export default TaskCard;
