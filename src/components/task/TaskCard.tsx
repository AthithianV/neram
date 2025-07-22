import { TASK_PRIORITY_COLOR, TaskPriority } from '@/constants/task';
import { ReadTask } from '@/hooks/useTask';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { AlarmCheck, Calendar } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const TaskCard = ({ task }: { task: ReadTask }) => {
    const [_, setSearchParams] = useSearchParams();

    const getPriorityColor = (priority?: string | null) => {
        const color = TASK_PRIORITY_COLOR[(priority as TaskPriority) ?? 'Default'];
        return color;
    };

    return (
        <Card
            key={task.id}
            className={cn(
                'cursor-pointer transition-all hover:shadow-md rounded-md gap-0 py-3 px-2 w-full',
                task.status === 'Completed' && 'opacity-70',
                // draggedTask?.id === task.id && 'opacity-50',
            )}
            onClick={() =>
                setSearchParams({
                    task_status: task.status,
                    modal: 'edit_task',
                    id: String(task.id),
                })
            }
            draggable
            // onDragStart={(e) => handleDragStart(e, task)}
        >
            <CardHeader className="px-2">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-semibold">{task.title}</CardTitle>
                    <div className="flex items-center gap-1">
                        <div
                            className={cn('w-2 rounded-full')}
                            style={{
                                backgroundColor: getPriorityColor(task.priority),
                            }}
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 px-2">
                {task.description && (
                    <div
                        className="text-xs text-muted-foreground line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: task.description }}
                    />
                )}

                <div className="flex gap-2 flex-wrap">
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
                                        {(task.estimated_time / 3600).toFixed(2)} h
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
                                            backgroundColor: getPriorityColor(task.priority),
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
                            <TooltipContent>Estimated At</TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default TaskCard;
