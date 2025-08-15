import {
    TASK_PRIORITY_COLOR,
    TASK_STATUS,
    TASK_STATUS_COLOR,
    TaskPriority,
    TaskStatus,
} from '@/constants/task';
import { ReadTask, useUpdateTask } from '@/hooks/useTask';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import {
    AlarmCheck,
    Calendar,
    CircleEllipsis,
    Edit,
    Flame,
    GripVertical,
    Move,
    Play,
    Square,
    Timer,
    Trash2,
} from 'lucide-react';
import React, { ReactNode, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

import { formatDate, formatDuration } from '@/lib/time';

import { useSettings } from '@/hooks/useSettings';
import { useStartTimer, useStopTimer, useTimer } from '@/hooks/useTimer';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

type PropType = { task: ReadTask; isDragged?: boolean };

const TaskCard = ({ task, isDragged }: PropType) => {
    const [_, setSearchParams] = useSearchParams();
    const [isHovered, setIsHovered] = useState(false);
    const [isHeaderHovered, setIsHeaderHovered] = useState(false);

    const { data: settings } = useSettings();

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
                    'transition-all hover:shadow-md rounded-md gap-0 py-3 px-4 w-full z-800',
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
                <CardHeader className="px-0">
                    <div className="flex items-start justify-between gap-2 overflow-visible relative">
                        <div
                            className={cn(
                                'cursor-grab left-[-15px] top-[2px] absolute ',
                                isHovered ? 'block' : 'hidden',
                            )}
                            onClick={(e) => e.stopPropagation()}
                            onMouseEnter={() => setIsHeaderHovered(true)}
                            onMouseLeave={() => setIsHeaderHovered(false)}
                            {...attributes}
                            {...listeners}
                        >
                            <GripVertical className="h-4 w-4" />
                        </div>
                        <CardTitle className="text-sm font-semibold py-0">
                            {task.title}
                        </CardTitle>
                        <TaskMoreOptions task={task} />
                    </div>
                </CardHeader>

                <CardContent className="space-y-2 px-0">
                    {!['Completed', 'Cancelled'].includes(task.status) && (
                        <div className="flex gap-1 flex-wrap item-center">
                            <TaskAttribute
                                title="Deadline"
                                text={
                                    task.deadline ? formatDeadLine(task.deadline) : null
                                }
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
                    )}

                    <TaskTimer task={task} />

                    <div className="flex items-center justify-between gap-1">
                        <Tooltip>
                            <TooltipTrigger>
                                <span className="text-muted-foreground text-xs font-semibold">
                                    {task.started_at &&
                                        formatDate(task.started_at, {
                                            format: settings?.date_format,
                                        })}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>Started At</TooltipContent>
                        </Tooltip>

                        {task.completed_at && (
                            <Tooltip>
                                <TooltipTrigger>
                                    <span className="text-muted-foreground text-xs font-semibold">
                                        {formatDate(task.completed_at, {
                                            format: settings?.date_format,
                                        })}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>Completed At</TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                </CardContent>
            </Card>
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
                        'bg-transparent text-gray-700 border-border',
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

const TaskMoreOptions = ({ task }: { task: ReadTask }) => {
    const { projectId } = useParams();

    const [_, setSearchParams] = useSearchParams();
    const { mutateAsync: updateTask } = useUpdateTask(Number(projectId));
    const { data: timer } = useTimer();
    const { mutateAsync: startTimer } = useStartTimer();
    const { mutateAsync: stopTimer } = useStopTimer();

    const handleStart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await startTimer({
            timerData: {
                taskId: task.id,
                timerType: 'Session',
                projectId: Number(projectId),
            },
            shouldCreateSession: true,
            sessionData: { title: `Session for "${task.title}"` },
        });
    };

    const handleStop = async (e: React.MouseEvent) => {
        e.stopPropagation();
        stopTimer();
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSearchParams({
            task_status: task.status,
            modal: 'edit_task',
            id: String(task.id),
        });
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSearchParams({
            task_id: task.id.toString(),
            alert: 'TASK',
        });
    };

    const updateTaskStatus = (e: React.MouseEvent, status: TaskStatus) => {
        e.stopPropagation();
        updateTask({ taskId: task.id, taskToUpdate: { ...task, status } });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <CircleEllipsis className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align={'end'}>
                {!(timer && timer.is_running) && (
                    <DropdownMenuItem onClick={handleStart}>
                        <Play className="text-green-500" />
                        Start Timer
                    </DropdownMenuItem>
                )}
                {timer && timer.task_id === task.id && (
                    <DropdownMenuItem onClick={handleStop}>
                        <Square className="text-red-500" />
                        Stop Timer
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={(e) => handleEdit(e)}>
                    <Edit className="text-blue-500" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleDelete(e)}>
                    <Trash2 className="text-red-500" />
                    Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger
                        className="flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Move className="text-pink-500 h-4 w-4" />
                        Status
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent asChild>
                            {TASK_STATUS.map((status) => (
                                <DropdownMenuItem
                                    onClick={(e) => updateTaskStatus(e, status)}
                                    key={status}
                                >
                                    <span
                                        style={{
                                            backgroundColor: TASK_STATUS_COLOR[status],
                                        }}
                                        className="w-3 h-3 rounded"
                                    ></span>
                                    {status}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const TaskTimer = ({ task }: { task: ReadTask }) => {
    const { data: timer } = useTimer();
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        setDuration(task.total_duration_sec || 0);
    }, []);

    useEffect(() => {
        const isTimerRunning = timer && timer.task_id === task.id && timer.is_running;
        if (isTimerRunning) {
            const startingTime = task.total_duration_sec || 0;
            setDuration(startingTime + (isTimerRunning ? timer.session_time_elapsed : 0));
        }
    }, [timer]);

    return (
        <TaskAttribute
            title="Total Time Spanned"
            text={formatDuration(duration)}
            icon={<Timer />}
            className={
                timer && timer.task_id === task.id
                    ? 'bg-emerald-500 border-2 border-black'
                    : 'bg-emerald-200'
            }
        />
    );
};

export default TaskCard;
