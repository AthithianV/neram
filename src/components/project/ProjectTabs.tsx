import { MinimalProject, useProject } from '@/hooks/useProject';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import LoaderWrapper from '@/components/layouts/Loader';
import { cn } from '@/lib/utils';
import { Edit, Folder, Plus, SquareArrowOutUpRight, Trash } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '../ui/context-menu';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

const ProjectTabs = () => {
    const [_, setSearchParams] = useSearchParams();
    const { data: projects, isLoading } = useProject();
    const navigate = useNavigate();
    const { projectId } = useParams();

    const handleAdd = async () => {
        if (projects && projects.length >= 5) {
            toast.warning('Cannot Add more than 5 Projects');
            return;
        }
        setSearchParams({ modal: 'add_project' });
    };

    useEffect(() => {
        if (projects && projects.length > 0) {
            navigate(`/project/${projects[0].id}`);
        }
    }, [projects]);

    if (isLoading || !projects || !projectId) {
        return <LoaderWrapper />;
    }

    const handleEdit = () => {
        setSearchParams({ id: projectId, modal: 'edit_project' });
    };

    const handleDelete = (projectId: number) => {
        if (projects && projects.length <= 1) {
            toast.warning(
                'Create more project to delete Current!🥺 Project Page cannot be empty👉👈',
            );
            return;
        }
        setSearchParams({ project_id: projectId.toString(), alert: 'PROJECT' });
    };

    return (
        <div className="flex items-center h-[var(--project-tab-height)]">
            <ScrollArea
                className={cn(
                    'max-w-[92%] max-xl:max-w-[88%]',
                    ' max-lg:max-w-[82%] max-md:max-w-[80%]',
                    'h-full',
                    'whitespace-nowrap',
                )}
            >
                <div className="flex gap-1">
                    {projects?.map((project) => (
                        <ContextMenu key={project.id}>
                            <ContextMenuTrigger>
                                <ProjectTab
                                    project={project}
                                    activeProjectId={Number(projectId)}
                                />
                            </ContextMenuTrigger>
                            <ContextMenuContent className="border">
                                <ContextMenuItem
                                    className="gap-2 pe-20"
                                    onClick={() => handleEdit()}
                                >
                                    <Edit className="text-sky-500" />
                                    Edit
                                </ContextMenuItem>
                                <ContextMenuItem
                                    className="gap-2 pe-20"
                                    onClick={() => handleDelete(project.id)}
                                >
                                    <Trash className="text-red-500" />
                                    Delete
                                </ContextMenuItem>
                                <ContextMenuItem className="gap-2 pe-20">
                                    <SquareArrowOutUpRight className="text-green-500" />
                                    Export
                                </ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <Button
                className="cursor-pointer h-full"
                variant={'ghost'}
                onClick={handleAdd}
            >
                <Plus className="w-4 h-4" />
            </Button>
        </div>
    );
};

const ProjectTab = ({
    project,
    activeProjectId,
}: {
    project: MinimalProject;
    activeProjectId: number;
}) => {
    const navigate = useNavigate();

    const isSelected = (tabId: number) => {
        return tabId === Number(activeProjectId);
    };

    return (
        <div
            key={project.id}
            className={cn(
                `py-2 px-4  cursor-pointer text-sm`,
                'flex gap-2 items-center',
                `${
                    isSelected(project.id)
                        ? `bg-background border-b-2 font-bold`
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`,
            )}
            style={
                isSelected(project.id)
                    ? {
                          borderColor: project.color,
                          color: project.color,
                      }
                    : { color: project.color }
            }
            onClick={() => navigate(`/project/${project.id}`)}
        >
            <Folder
                className="h-4 w-4"
                fill={isSelected(project.id) ? 'currentColor' : 'transparent'}
            />
            {project.title}
        </div>
    );
};

export default ProjectTabs;
