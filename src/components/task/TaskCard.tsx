import { TASK_PRIORITY_COLOR, TaskPriority } from '@/constants/task';
import { ReadTask } from '@/hooks/useTask';
import { cn } from '@/lib/utils';
import { useDraggable } from '@dnd-kit/core';
import dayjs from 'dayjs';
import { AlarmCheck, Calendar, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import DeleteTask from './DeleteTask';

type PropType = { task: ReadTask; isDragged?: boolean };

const TaskCard = ({ task, isDragged }: PropType) => {
    const [_, setSearchParams] = useSearchParams();
    const [isHovered, setIsHovered] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id,
    });

    const style = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
    };

    const getPriorityColor = (priority?: string | null) => {
        const color = TASK_PRIORITY_COLOR[(priority as TaskPriority) ?? 'Default'];
        return color;
    };

    const getOpacity = () => {
        const { status } = task;
        return status === 'Completed' || status === 'Cancelled' || isDragged
            ? 'opacity-50'
            : '';
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card
                className={cn(
                    'transition-all hover:shadow-md rounded-md gap-0 py-3 px-2 w-full z-800',
                    'cursor-pointer',
                    getOpacity(),
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
                // onDragStart={(e) => handleDragStart(e, task)}
            >
                <CardHeader className="px-2">
                    <div className="flex items-center justify-between gap-2">
                        <CardTitle
                            className="text-sm font-semibold cursor-grab"
                            {...attributes}
                            {...listeners}
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
                    {task.description && (
                        <div
                            className="text-xs text-muted-foreground line-clamp-2"
                            dangerouslySetInnerHTML={{
                                __html: task.description,
                            }}
                        />
                    )}

                    <div className="flex gap-1 flex-wrap item-center">
                        {task.deadline && (
                            <Tooltip>
                                <TooltipTrigger>
                                    <Badge
                                        className={cn(
                                            'flex items-center justify-between',
                                            'bg-transparent text-gray-700 border-gray-200',
                                            'text-xs py-1',
                                        )}
                                    >
                                        <Calendar className="h-4 w-4" />
                                        <span className={cn('font-medium')}>
                                            {dayjs(task.deadline).format('DD MMM YYYY')}
                                        </span>
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>Deadline</TooltipContent>
                            </Tooltip>
                        )}

                        {task.estimated_time !== 0 && task.estimated_time && (
                            <Tooltip>
                                <TooltipTrigger>
                                    <Badge
                                        className={cn(
                                            'flex items-center justify-between',
                                            'bg-transparent text-gray-700 border-gray-200',
                                            'text-xs py-1',
                                        )}
                                    >
                                        <AlarmCheck className="h-4 w-4" />
                                        <span className={cn('font-medium')}>
                                            {(task.estimated_time / 3600).toFixed(1)} h
                                        </span>
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>Estimated Time</TooltipContent>
                            </Tooltip>
                        )}

                        {task.priority && (
                            <div className="flex items-center justify-between">
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Badge
                                            className={cn('text-xs')}
                                            style={{
                                                backgroundColor: getPriorityColor(
                                                    task.priority,
                                                ),
                                            }}
                                        >
                                            {task.priority}
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>Priority</TooltipContent>
                                </Tooltip>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-1">
                        {task.started_at && (
                            <Tooltip>
                                <TooltipTrigger>
                                    <span className="text-muted-foreground text-xs font-semibold">
                                        {dayjs(task.started_at).format('DD MMM YYYY')}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>Started At</TooltipContent>
                            </Tooltip>
                        )}

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

export default TaskCard;
