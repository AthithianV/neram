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
import { useParams, useSearchParams } from 'react-router-dom';
import DeleteProject from './DeleteProject';

const ProjectSettings = () => {
    const { projectId } = useParams();

    if (!projectId) {
        return null;
    }

    const [_, setSearchParams] = useSearchParams();
    const { data: project } = useProjectById(Number(projectId) ?? 0);

    if (!project) {
        return null;
    }

    return (
        <DropdownMenu>
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
                    onClick={() => setSearchParams({ id: projectId, modal: 'edit_project' })}
                >
                    <Button
                        variant="ghost"
                        onClick={(e) => e.stopPropagation()}
                        className="cursor-pointer !h-5 !p-0"
                    >
                        <Edit className="text-blue-500" />
                        Edit
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <DeleteProject projectId={project.id}>
                        <Button
                            variant="ghost"
                            onClick={(e) => e.stopPropagation()}
                            className="cursor-pointer !h-5"
                        >
                            <Trash className="w-4 h-4 text-red-500" />
                            Delete
                        </Button>
                    </DeleteProject>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProjectSettings;
