import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    closestCorners,
    useDroppable,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { TASK_STATUS, TASK_STATUS_COLOR, TaskStatus } from '@/constants/task';
import { ReadTask, useTask, useUpdateTask } from '@/hooks/useTask';
import { toDBTime } from '@/lib/time';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import LoaderWrapper from '../layouts/Loader';
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
    const { data: tasksData = [], isLoading } = useTask(Number(projectId));

    const [_, setSearchParams] = useSearchParams();
    const [activeTask, setActiveTask] = useState<ReadTask | null>(null);
    const { mutateAsync: updateTask } = useUpdateTask(Number(projectId));

    const [tasks, setTasks] = useState<ReadTask[]>([]);
    const [overColumn, setOverColumn] = useState<TaskStatus | null>(null);

    useEffect(() => {
        setTasks([...tasksData]);
    }, [tasksData]);

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

    const handleDragOver = useCallback((event: DragOverEvent) => {
        setOverColumn((event.over?.id as TaskStatus | null) ?? null);
    }, []);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || !activeTask || active.id === over.id) {
            setActiveTask(null);
            return;
        }

        const activeId = active.id;
        const overId = over.id;

        const activeTaskData = tasks.find((t) => t.id === activeId);
        const overTaskData = tasks.find((t) => t.id === overId);

        const isOverAColumn = TASK_STATUS.includes(overId as TaskStatus);
        const newStatus: TaskStatus = isOverAColumn
            ? (overId as TaskStatus)
            : ((overTaskData?.status ?? activeTaskData?.status) as TaskStatus);

        const oldStatus = activeTaskData?.status;

        // Case 1: Move to another column (status change)
        if (oldStatus !== newStatus) {
            const updatedTasks = tasks.map((task) =>
                task.id === activeId ? { ...task, status: newStatus } : task,
            );
            setTasks(updatedTasks);

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

            setActiveTask(null);
            return;
        }

        // Case 2: Reorder within same column
        if (overTaskData && oldStatus === overTaskData.status) {
            const columnTasks = tasks.filter((t) => t.status === oldStatus);
            const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
            const newIndex = columnTasks.findIndex((t) => t.id === overId);

            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                const reordered = [...columnTasks];
                const [moved] = reordered.splice(oldIndex, 1);
                reordered.splice(newIndex, 0, moved);

                const nonColumnTasks = tasks.filter((t) => t.status !== oldStatus);
                setTasks([...nonColumnTasks, ...reordered]);
            }
        }

        setActiveTask(null);
    };

    if (isLoading || !projectId) {
        return <LoaderWrapper />;
    }

    return (
        <ScrollArea className="">
            <DndContext
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
            >
                <div className="flex gap-1 h-[var(--kanban-height)]">
                    {columns.map((column) => (
                        <Column
                            key={column.id}
                            column={column}
                            setSearchParams={setSearchParams}
                            overColumn={overColumn}
                        />
                    ))}
                </div>
                <DragOverlay>
                    {activeTask ? (
                        <TaskCard
                            key={activeTask.id}
                            task={activeTask}
                            isDragged={true}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
};

const Column = ({
    column,
    setSearchParams,
    overColumn,
}: {
    column: KanbanColumn;
    setSearchParams: ReturnType<typeof useSearchParams>[1];
    overColumn: TaskStatus | null;
}) => {
    const { setNodeRef } = useDroppable({ id: column.id });

    return (
        <div
            className={cn(
                'w-[18vw] max-lg:w-[25vw] h-fit max-h-full',
                'rounded-md bg-sidebar shadow-sm p-2 border-2 border-border',
                overColumn === column.id && 'bg-sky-100 dark:bg-sky-800',
                'animate-page-fade-in',
            )}
            ref={setNodeRef}
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
                <SortableContext
                    items={column.tasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <ScrollArea>
                        <div className="space-y-1 max-h-[var(--kanban-column-height)]">
                            {column.tasks.map((task) => (
                                <Suspense
                                    fallback={<Skeleton className="flex-1 h-12" />}
                                    key={task.id}
                                >
                                    <TaskCard task={task} key={task.id} />
                                </Suspense>
                            ))}
                        </div>
                        <ScrollBar orientation="vertical" />
                    </ScrollArea>
                </SortableContext>

                <Button
                    className="!h-8 cursor-pointer !w-fit text-xs"
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
    );
};

export default Kanban;
