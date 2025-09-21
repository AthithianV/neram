import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProject, useProjectById } from '@/hooks/useProject';
import { Edit, Settings, Trash } from 'lucide-react';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import LoaderWrapper from '../layouts/Loader';
import DeleteProject from './DeleteProject';

const ProjectSettings = () => {
    const { projectId } = useParams();
    const [open, setOpen] = useState(false);
    const [isAlertOpen, setAlertOpen] = useState(false);

    const [_, setSearchParams] = useSearchParams();
    const { data: project } = useProjectById(Number(projectId) ?? 0);
    const { data: projects } = useProject();

    if (!project || !projectId) {
        return <LoaderWrapper />;
    }

    const handleEdit = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        setOpen(false);
        setSearchParams({ id: projectId, modal: 'edit_project' });
    };

    const handleDelete = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        if (projects && projects.length <= 1) {
            toast.warning(
                'Create more project to delete Current!🥺 Project Page cannot be empty👉👈',
            );
            return;
        }
        setOpen(false);
        setAlertOpen(true);
    };

    return (
        <div className="h-full">
            {' '}
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild className="!h-full">
                    <Button className="cursor-pointer" variant={'ghost'}>
                        <Settings className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side={'bottom'} align="end">
                    <DropdownMenuLabel>{project.title}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={(e) => handleEdit(e)}
                    >
                        <Edit className="text-blue-500" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleDelete(e)}>
                        <Trash className="w-4 h-4 text-red-500" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DeleteProject isAlertOpen={isAlertOpen} setAlertOpen={setAlertOpen} />
        </div>
    );
};

export default ProjectSettings;
