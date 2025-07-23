import { Badge } from '@/components/ui/badge';
import { TASK_STATUS, TASK_STATUS_COLOR, TaskStatus } from '@/constants/task';
import { ReadTask, useTask } from '@/hooks/useTask';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import TaskCard from '../task/TaskCard';
import { Button } from '../ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

interface KanbanColumn {
    id: string;
    title: TaskStatus;
    style: any;
    tasks: ReadTask[];
}

const Kanban = () => {
    const { projectId } = useParams();
    const [_, setSearchParams] = useSearchParams();

    const { data: tasks = [] } = useTask(Number(projectId));
    const [draggedTask, setDraggedTask] = useState<ReadTask | null>(null);

    if (!projectId) {
        return null;
    }

    const columns: KanbanColumn[] = useMemo(
        () =>
            TASK_STATUS.map((taskTitle) => ({
                id: taskTitle,
                title: taskTitle,
                style: {
                    backgroundColor: TASK_STATUS_COLOR[taskTitle as TaskStatus],
                },
                tasks: tasks.filter((task) => task.status === taskTitle),
            })),
        [tasks],
    );

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
            // await updateTask.mutateAsync({
            //     ...draggedTask,
            //     status: targetStatus,
            //     started_at: draggedTask.started_at.toISOString(),
            //     deadline: draggedTask.deadline?.toISOString(),
            //     completed_at:
            //         targetStatus === 'done'
            //             ? new Date().toISOString()
            //             : undefined,
            // });
        } catch (error) {
            console.error('Failed to update task status:', error);
        }

        setDraggedTask(null);
    };

    return (
        <ScrollArea className="h-full">
            <div className="flex gap-1 h-full">
                {columns.map((column) => (
                    <div className="flex-1 min-w-[18vw]" key={column.id}>
                        <div
                            key={column.id}
                            className={cn(
                                'rounded-md',
                                'bg-white shadow-sm p-2 border-2 border-gray-100',
                            )}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, column.id)}
                        >
                            <div className="flex items-center justify-between">
                                <Badge
                                    className={cn('font-semibold rounded text-gary-100')}
                                    style={column.style}
                                >
                                    {column.title}
                                </Badge>
                                <Badge variant="secondary" style={column.style}>
                                    {column.tasks.length}
                                </Badge>
                            </div>

                            <div className="py-2 space-y-2 flex flex-col">
                                <ScrollArea>
                                    <div className="max-h-[70vh] space-y-1">
                                        {column.tasks.map((task) => (
                                            <TaskCard task={task} key={task.id} />
                                        ))}
                                    </div>
                                </ScrollArea>

                                <Button
                                    className="!h-8 cursor-pointer hover:bg-gray-100 !w-fit !text-gray-700 text-xs"
                                    variant={'ghost'}
                                    onClick={() =>
                                        setSearchParams({
                                            task_status: column.title,
                                            modal: 'add_task',
                                        })
                                    }
                                >
                                    <Plus /> Add Task
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
};

export default Kanban;
