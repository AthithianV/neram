import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProjectById } from '@/hooks/useProject';
import { Edit, Settings, Trash } from 'lucide-react';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import DeleteProject from './DeleteProject';

const ProjectSettings = () => {
    const { projectId } = useParams();
    const [open, setOpen] = useState(false);
    const [isAlertOpen, setAlertOpen] = useState(false);

    const [_, setSearchParams] = useSearchParams();
    const { data: project } = useProjectById(Number(projectId) ?? 0);

    if (!project || !projectId) {
        return null;
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
        setOpen(false);
        setAlertOpen(true);
    };

    return (
        <div>
            {' '}
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button className="mb-3 cursor-pointer" variant={'outline'}>
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
            <DeleteProject
                projectId={project.id}
                isAlertOpen={isAlertOpen}
                setAlertOpen={setAlertOpen}
            />
        </div>
    );
};

export default ProjectSettings;
