import React, { useState, useMemo } from 'react';
import { Task, useTask } from '@/hooks/useTask';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { useParams } from 'react-router-dom';
import TaskCard from '../task/TaskCard';
import { Plus } from 'lucide-react';
import TaskForm from '../task/TaskForm';

interface KanbanColumn {
    id: string;
    title: string;
    color: string;
    tasks: Task[];
}

const Kanban = () => {
    const { projectId } = useParams();

    const { data: tasks = [] } = useTask(Number(projectId) ?? 0);
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);

    const columns: KanbanColumn[] = useMemo(
        () => [
            {
                id: 'Planning',
                title: 'Planning',
                color: 'bg-[#0EA5E9] border-blue-200',
                tasks: tasks.filter((task) => task.status === 'Planning'),
            },
            {
                id: 'in_progress',
                title: 'In Progress',
                color: 'bg-[#FACC15] border-yellow-200',
                tasks: tasks.filter((task) => task.status === 'In Progress'),
            },
            {
                id: 'review',
                title: 'Review',
                color: 'bg-[#EF4444] border-purple-200',
                tasks: tasks.filter((task) => task.status === 'review'),
            },
            {
                id: 'Completed',
                title: 'Completed',
                color: 'bg-[#10B981] border-green-200',
                tasks: tasks.filter((task) => task.status === 'Completed'),
            },
        ],
        [tasks],
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
                    <div className="h-full w-[25%]">
                        <ScrollArea className="h-full">
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
                                        className={cn(
                                            'font-semibold rounded text-gary-100',
                                            column.color,
                                        )}
                                    >
                                        {column.title}
                                    </Badge>
                                    <Badge
                                        variant="secondary"
                                        className={cn(column.color)}
                                    >
                                        {column.tasks.length}
                                    </Badge>
                                </div>

                                <div className="py-2 space-y-2">
                                    {column.tasks.map((task) => (
                                        <TaskCard task={task} />
                                    ))}

                                    <TaskForm />
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
};

export default Kanban;
