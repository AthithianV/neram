import { useDeleteProject } from '@/hooks/useProject';
import { Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

type PropType = {
    isAlertOpen: boolean;
    setAlertOpen: (state: boolean) => void;
};

const DeleteProject = ({ setAlertOpen, isAlertOpen }: PropType) => {
    const navigate = useNavigate();
    const { mutateAsync: deleteProject, isPending } = useDeleteProject();
    const [searchParams] = useSearchParams();

    const handleDelete = async () => {
        const projectId = Number(searchParams.get('project_id'));
        if (projectId && !isNaN(projectId)) {
            await deleteProject(projectId);
        }
        setAlertOpen(false);
        navigate('/project');
    };

    return (
        <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
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

export default DeleteProject;
