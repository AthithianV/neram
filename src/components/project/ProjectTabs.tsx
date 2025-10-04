import { MinimalProject, useProject } from '@/hooks/useProject';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import LoaderWrapper from '@/components/layouts/Loader';
import { cn } from '@/lib/utils';
import { Edit, Folder, Plus, SquareArrowOutUpRight, Trash } from 'lucide-react';
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
    const { projectId } = useParams();

    const handleAdd = async () => {
        setSearchParams({ modal: 'add_project' });
    };

    if (isLoading || !projects) {
        return <LoaderWrapper />;
    }

    const handleEdit = () => {
        if (projectId) {
            setSearchParams({ id: projectId, modal: 'edit_project' });
        }
    };

    const handleDelete = (projectId: number) => {
        setSearchParams({ project_id: projectId.toString(), alert: 'PROJECT' });
    };

    return (
        <div className="h-[var(--project-tab-height)] mb-1 bg-sidebar flex">
            <ScrollArea
                className={cn(
                    'max-w-[92%] max-xl:max-w-[88%]',
                    ' max-lg:max-w-[82%] max-md:max-w-[80%]',
                    'h-full',
                    'whitespace-nowrap',
                )}
            >
                <div className="bg-slate-100 dark:bg-slate-900 flex items-center w-fit rounded-t-sm">
                    <div className="flex">
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
                </div>

                <ScrollBar orientation="horizontal" className="h-1" />
            </ScrollArea>

            <Button
                className="cursor-pointer h-[var(--project-tab-height)] rounded-t-sm"
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
            className={cn(
                'flex gap-2 items-center cursor-pointer',
                'px-3',
                'h-[var(--project-tab-height)] rounded-t-sm',
                `${
                    isSelected(project.id)
                        ? `bg-background h-full`
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`,
            )}
            onClick={() => navigate(`/project/${project.id}`)}
        >
            <div
                key={project.id}
                className={cn(
                    `text-sm`,
                    'flex gap-2 items-center py-2',
                    `${isSelected(project.id) ? `border-b-2 font-bold` : ''}`,
                )}
                style={
                    isSelected(project.id)
                        ? {
                              borderColor: project.color,
                              color: project.color,
                          }
                        : { color: project.color }
                }
            >
                <Folder
                    className="h-4 w-4"
                    fill={
                        isSelected(project.id) ? 'currentColor' : 'transparent'
                    }
                />
                {project.title}
            </div>
        </div>
    );
};

export default ProjectTabs;
