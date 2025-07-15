import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import TaskSchema, { Task } from '@/schema/TaskSchema';
import { Badge } from '../ui/badge';
import { Plus } from 'lucide-react';

const TaskForm = () => {
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(TaskSchema),
        defaultValues: {
            status: 'Planning',
            priority: 'Low',
        },
    });

    const onSubmit = (data: Task) => {
        console.log('Form Data:', data);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Badge
                    className="py-1 cursor-pointer hover:bg-gray-200"
                    variant={'secondary'}
                >
                    <Plus /> Add Task
                </Badge>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input placeholder="Title" {...register('title')} />
                    {errors.title && (
                        <p className="text-red-500 text-sm">
                            {errors.title.message}
                        </p>
                    )}

                    <Textarea
                        placeholder="Description"
                        {...register('description')}
                    />

                    <Input
                        placeholder="Color (e.g. #FF0000)"
                        {...register('color')}
                    />
                    {errors.color && (
                        <p className="text-red-500 text-sm">
                            {errors.color.message}
                        </p>
                    )}

                    <Input
                        placeholder="Project ID"
                        type="number"
                        {...register('project_id', { valueAsNumber: true })}
                    />
                    {errors.project_id && (
                        <p className="text-red-500 text-sm">
                            {errors.project_id.message}
                        </p>
                    )}

                    <Input
                        placeholder="Priority (Low, Medium, High)"
                        {...register('priority')}
                    />

                    <Input
                        placeholder="Status (Planning, In Progress, Done)"
                        {...register('status')}
                    />

                    <Input
                        placeholder="Deadline"
                        type="datetime-local"
                        {...register('deadline')}
                    />

                    <Input
                        placeholder="Started At"
                        type="datetime-local"
                        {...register('started_at')}
                    />
                    {errors.started_at && (
                        <p className="text-red-500 text-sm">
                            {errors.started_at.message}
                        </p>
                    )}

                    <Input
                        placeholder="Completed At"
                        type="datetime-local"
                        {...register('completed_at')}
                    />

                    <Input
                        placeholder="Estimated Time (minutes)"
                        type="number"
                        {...register('estimated_time', { valueAsNumber: true })}
                    />

                    <Button type="submit">Submit</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TaskForm;
