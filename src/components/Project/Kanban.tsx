import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    closestCorners,
    useDroppable,
} from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import React, { Suspense, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { TASK_STATUS, TASK_STATUS_COLOR, TaskStatus } from '@/constants/task';
import { ReadTask, useTask, useUpdateTask } from '@/hooks/useTask';
import { toDBTime } from '@/lib/time';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { Button } from '../ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';

const TaskCard = React.lazy(() => import('../task/TaskCard'));

interface KanbanColumn {
    id: string;
    title: TaskStatus;
    style: any;
    tasks: ReadTask[];
}

const Kanban = () => {
    const { projectId } = useParams();
    const { data: tasks = [] } = useTask(Number(projectId));

    const [_, setSearchParams] = useSearchParams();
    const [activeTask, setActiveTask] = useState<ReadTask | null>(null);
    const { mutateAsync: updateTask } = useUpdateTask(Number(projectId));

    if (!projectId) return null;

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

    const handleDragStart = (event: DragStartEvent) => {
        const taskId = event.active.id;
        const task = tasks.find((t) => t.id === taskId);
        if (task) {
            setActiveTask(task);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || !activeTask || active.id === over.id) {
            setActiveTask(null);
            return;
        }

        const newStatus = over.id as TaskStatus;

        if (activeTask.status !== newStatus) {
            try {
                await updateTask({
                    taskToUpdate: {
                        ...activeTask,
                        status: newStatus,
                        completed_at:
                            newStatus === 'Completed'
                                ? toDBTime(dayjs().toString())
                                : undefined,
                    },
                    taskId: activeTask.id,
                });
            } catch (error) {
                console.error('Failed to update task status:', error);
            }
        }

        setActiveTask(null);
    };

    return (
        <ScrollArea className="h-full">
            <DndContext
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-1 h-full">
                    {columns.map((column) => (
                        <Column
                            key={column.id}
                            column={column}
                            setSearchParams={setSearchParams}
                        />
                    ))}
                </div>
                <DragOverlay>
                    {activeTask ? <TaskCard task={activeTask} isDragged={true} /> : null}
                </DragOverlay>
            </DndContext>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
};

const Column = ({
    column,
    setSearchParams,
}: {
    column: KanbanColumn;
    setSearchParams: ReturnType<typeof useSearchParams>[1];
}) => {
    const { setNodeRef, isOver } = useDroppable({ id: column.id });

    return (
        <div className="flex-1 min-w-[18vw] max-lg:min-w-[25vw]" ref={setNodeRef}>
            <div
                className={cn(
                    'rounded-md bg-white shadow-sm p-2 border-2 border-gray-100',
                    isOver && 'bg-sky-100',
                )}
            >
                <div className="flex items-center justify-between">
                    <Badge
                        className={cn('font-semibold rounded text-white')}
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
                                <Suspense
                                    fallback={<Skeleton className="flex-1 h-12" />}
                                    key={task.id}
                                >
                                    <TaskCard task={task} />
                                </Suspense>
                            ))}
                        </div>
                        <ScrollBar orientation="vertical" />
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
    );
};

export default Kanban;
