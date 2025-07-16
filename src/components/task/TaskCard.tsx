import { Task } from '@/hooks/useTask';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { Badge } from '../ui/badge';
import { AlarmCheck, Calendar } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { TASK_PRIORITY_COLOR, TaskPriority } from '@/constants/project';

const TaskCard = ({ task }: { task: Task }) => {
    const getPriorityColor = (priority?: string | null) => {
        const color =
            TASK_PRIORITY_COLOR[(priority as TaskPriority) ?? 'Default'];
        return color;
    };

    return (
        <Card
            key={task.id}
            className={cn(
                'cursor-move transition-all hover:shadow-md rounded-md gap-0 py-3 px-2',
                // draggedTask?.id === task.id && 'opacity-50',
            )}
            draggable
            // onDragStart={(e) => handleDragStart(e, task)}
        >
            <CardHeader className="px-2">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-semibold">
                        {task.title}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                        <div
                            className={cn('w-2 rounded-full')}
                            style={{
                                backgroundColor: getPriorityColor(
                                    task.priority,
                                ),
                            }}
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 px-2">
                {task.description && (
                    <p className="text-xs text-muted-foreground">
                        {task.description}
                    </p>
                )}

                <div className="flex gap-2">
                    {task.deadline && (
                        <Tooltip>
                            <TooltipTrigger>
                                <Badge className="flex items-center justify-between bg-transparent text-xs text-gray-700 border-gray-200 py-1">
                                    <Calendar className="h-4 w-4" />
                                    <span className={cn('font-medium')}>
                                        {dayjs(task.deadline).format(
                                            'DD MMM YYYY',
                                        )}
                                    </span>
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>Deadline</TooltipContent>
                        </Tooltip>
                    )}

                    {task.estimated_time && (
                        <Tooltip>
                            <TooltipTrigger>
                                <Badge className="flex items-center justify-between bg-transparent text-xs text-gray-700 border-gray-200 py-1">
                                    <AlarmCheck className="h-4 w-4" />
                                    <span className={cn('font-medium')}>
                                        {task.estimated_time / 3600}h
                                    </span>
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>Estimated Time</TooltipContent>
                        </Tooltip>
                    )}

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
                </div>

                <div className="flex items-center gap-1">
                    {task.started_at && (
                        <span className="text-xs text-muted-foreground">
                            Started:{' '}
                            {dayjs(task.started_at).format('DD MMM YYYY')}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default TaskCard;
