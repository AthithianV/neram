import { useProject } from '@/hooks/useProject';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import LoaderWrapper from '@/components/layouts/Loader';
import { cn } from '@/lib/utils';
import { Folder, Plus } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import ProjectSettings from './ProjectSettings';

const ProjectTabs = () => {
    const [_, setSearchParams] = useSearchParams();
    const { data: projects, isLoading } = useProject();
    const { projectId } = useParams();
    const navigate = useNavigate();

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

    const isSelected = (tabId: number) => {
        return projectId && tabId === Number(projectId);
    };

    if (isLoading || !projects) {
        return <LoaderWrapper />;
    }

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
                    {projects?.map(({ id, title, color }) => (
                        <div
                            key={id}
                            className={cn(
                                `py-2 px-4  cursor-pointer text-sm`,
                                'flex gap-2 items-center',
                                `${
                                    isSelected(id)
                                        ? `bg-background border-b-2 font-bold`
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`,
                            )}
                            style={
                                isSelected(id)
                                    ? {
                                          borderColor: color,
                                          color: color,
                                      }
                                    : { color: color }
                            }
                            onClick={() => navigate(`/project/${id}`)}
                        >
                            <Folder
                                className="h-4 w-4"
                                fill={isSelected(id) ? 'currentColor' : 'transparent'}
                            />
                            {title}
                        </div>
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
            <ProjectSettings />
        </div>
    );
};

export default ProjectTabs;
