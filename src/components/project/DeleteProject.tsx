import { useDeleteProject } from '@/hooks/useProject';
import { Loader2, Trash } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

type PropType = {
    projectId: number;
};

const DeleteProject = ({ projectId }: PropType) => {
    const { mutateAsync: deleteProject, isPending } = useDeleteProject();

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    onClick={(e) => e.stopPropagation()}
                    className="cursor-pointer"
                >
                    <Trash className="w-4 h-4 text-red-500" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to delete this project?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        All session and Task related to this project will also be deleted.
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
                        onClick={async (e) => {
                            e.stopPropagation();
                            projectId && (await deleteProject(projectId));
                        }}
                        disabled={isPending}
                        className="bg-red-500 hover:bg-red-600 cursor-pointer"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteProject;
