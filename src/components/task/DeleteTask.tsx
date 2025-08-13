import { Checkbox } from '@/components/ui/checkbox';
import { useDeleteTask } from '@/hooks/useTask';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../ui/alert-dialog';
import { Label } from '../ui/label';

type PropType = {
    isAlertOpen: boolean;
    setAlertOpen: (state: boolean) => void;
};

const DeleteTask = ({ setAlertOpen, isAlertOpen }: PropType) => {
    const { mutateAsync: deleteTask, isPending } = useDeleteTask();
    const [searchParam] = useSearchParams();
    const [shouldDeleteSessions, setShouldDeleteSessions] = useState(false);

    const handleDelete = async () => {
        const taskId = Number(searchParam.get('task_id'));
        if (taskId && !isNaN(taskId)) {
            await deleteTask(taskId);
            setAlertOpen(false);
        }
    };

    return (
        <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to delete this task?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="flex gap-2 my-2 items-center">
                        <Checkbox
                            checked={shouldDeleteSessions}
                            onCheckedChange={(val) =>
                                setShouldDeleteSessions(
                                    val === 'indeterminate' ? false : val,
                                )
                            }
                            className="shadow border-1 border-black"
                        />
                        <Label>Should Delete all Associated Sessions</Label>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        className="cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isPending}
                        className="bg-red-500 hover:bg-red-600 cursor-pointer"
                    >
                        {isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            'Delete'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteTask;
