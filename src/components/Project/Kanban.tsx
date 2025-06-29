import React, { useState, useMemo } from 'react';
import { useTask, useUpdateTask } from '@/hooks/useTask';
import { useProject } from '@/hooks/useProject';
import { Task } from '@/schema/TaskSchema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

interface KanbanColumn {
    id: string;
    title: string;
    color: string;
    tasks: Task[];
}

const Kanban = () => {
    const { data: tasks = [], isLoading } = useTask();
    const { data: projects = [] } = useProject();
    const updateTask = useUpdateTask();
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);

    const columns: KanbanColumn[] = useMemo(
        () => [
            {
                id: 'todo',
                title: 'To Do',
                color: 'bg-blue-50 border-blue-200',
                tasks: tasks.filter((task) => task.status === 'todo'),
            },
            {
                id: 'in_progress',
                title: 'In Progress',
                color: 'bg-yellow-50 border-yellow-200',
                tasks: tasks.filter((task) => task.status === 'in_progress'),
            },
            {
                id: 'review',
                title: 'Review',
                color: 'bg-purple-50 border-purple-200',
                tasks: tasks.filter((task) => task.status === 'review'),
            },
            {
                id: 'done',
                title: 'Done',
                color: 'bg-green-50 border-green-200',
                tasks: tasks.filter((task) => task.status === 'done'),
            },
        ],
        [tasks]
    );

    const handleDragStart = (e: React.DragEvent, task: Task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
        e.preventDefault();

        if (!draggedTask || draggedTask.status === targetStatus) {
            setDraggedTask(null);
            return;
        }

        try {
            await updateTask.mutateAsync({
                ...draggedTask,
                status: targetStatus,
                started_at: draggedTask.started_at.toISOString(),
                deadline: draggedTask.deadline?.toISOString(),
                completed_at:
                    targetStatus === 'done'
                        ? new Date().toISOString()
                        : undefined,
            });
        } catch (error) {
            console.error('Failed to update task status:', error);
        }

        setDraggedTask(null);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'bg-red-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'low':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getProjectName = (projectId: number) => {
        const project = projects.find((p) => p.id === projectId);
        return project?.title || 'Unknown Project';
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
        }).format(date);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Loading tasks...</div>
            </div>
        );
    }

    return (
        <div className="h-[98%] overflow-hidden py-2">
            {/* <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Kanban Board</h2>
                <div className="text-sm text-muted-foreground">
                    {tasks.length} tasks total
                </div>
            </div> */}

            <ScrollArea className="w-full h-full">
                <div className="flex gap-2 pb-4 min-w-max">
                    {columns.map((column) => (
                        <div
                            key={column.id}
                            className={cn(
                                'flex-shrink-0 w-80 rounded-lg border bg-white border-gray-200',
                                draggedTask &&
                                    draggedTask.status !== column.id &&
                                    'border-blue-300 bg-blue-50',
                                'shadow-sm',
                                column.color
                            )}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, column.id)}
                        >
                            <div className={cn('p-2 border-b-2')}>
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-800">
                                        {column.title}
                                    </h3>
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {column.tasks.length}
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-2 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                                {column.tasks.map((task) => (
                                    <Card
                                        key={task.id}
                                        className={cn(
                                            'cursor-move transition-all hover:shadow-md',
                                            draggedTask?.id === task.id &&
                                                'opacity-50'
                                        )}
                                        draggable
                                        onDragStart={(e) =>
                                            handleDragStart(e, task)
                                        }
                                    >
                                        <CardHeader className="pb-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <CardTitle className="text-sm font-medium line-clamp-2">
                                                    {task.title}
                                                </CardTitle>
                                                <div className="flex items-center gap-1">
                                                    <div
                                                        className={cn(
                                                            'w-2 h-2 rounded-full',
                                                            getPriorityColor(
                                                                task.priority
                                                            )
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pt-0">
                                            {task.description && (
                                                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                                    {task.description}
                                                </p>
                                            )}

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-muted-foreground">
                                                        Project:
                                                    </span>
                                                    <span className="font-medium">
                                                        {getProjectName(
                                                            task.project_id
                                                        )}
                                                    </span>
                                                </div>

                                                {task.deadline && (
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-muted-foreground">
                                                            Deadline:
                                                        </span>
                                                        <span
                                                            className={cn(
                                                                'font-medium',
                                                                new Date(
                                                                    task.deadline
                                                                ) <
                                                                    new Date() &&
                                                                    'text-red-500'
                                                            )}
                                                        >
                                                            {formatDate(
                                                                task.deadline
                                                            )}
                                                        </span>
                                                    </div>
                                                )}

                                                {task.estimated_time && (
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-muted-foreground">
                                                            Est. Time:
                                                        </span>
                                                        <span className="font-medium">
                                                            {
                                                                task.estimated_time
                                                            }
                                                            h
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                        style={{
                                                            borderColor:
                                                                task.color,
                                                            color: task.color,
                                                        }}
                                                    >
                                                        {task.priority}
                                                    </Badge>

                                                    <div className="flex items-center gap-1">
                                                        {task.started_at && (
                                                            <span className="text-xs text-muted-foreground">
                                                                Started:{' '}
                                                                {formatDate(
                                                                    task.started_at
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {column.tasks.length === 0 && (
                                    <div className="flex items-center justify-center h-32 text-muted-foreground text-sm border-2 border-dashed border-gray-200 rounded-lg">
                                        No tasks
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
};

export default Kanban;
