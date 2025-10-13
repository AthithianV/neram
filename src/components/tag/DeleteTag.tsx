import { useDeleteTag } from '@/hooks/useTag';
import { Loader2, X } from 'lucide-react';
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

const DeleteTag = ({
    tagId,
    clearSelectedTag,
}: {
    tagId: number;
    clearSelectedTag: () => void;
}) => {
    const { mutateAsync: deleteTag, isPending } = useDeleteTag();

    const handleDelete = async () => {
        await deleteTag(tagId);
        clearSelectedTag();
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger
                className="cursor-pointer"
                onClick={(e) => e.stopPropagation()}
            >
                <X size={12} />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to delete this Tag?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {/* All session and Task related to this project will also be deleted. */}
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

export default DeleteTag;
