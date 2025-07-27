import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useProject } from '@/hooks/useProject';
import { cn } from '@/lib/utils';
import { Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import LoaderWrapper from '@/components/layouts/Loader';
import PageAnimation from '@/components/layouts/PageAnimation';
import ProjectSettings from '@/components/project/ProjectSettings';
import { Button } from '@/components/ui/button';
import { Folder, Plus } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const Project = () => {
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

    if (isLoading || !projects) {
        return <LoaderWrapper />;
    }

    return (
        <PageAnimation>
            <div className="h-full">
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
                                <div
                                    key={project.id}
                                    className={cn(
                                        `py-2 px-4  cursor-pointer text-sm  min-w-fit font-bold`,
                                        'flex gap-2 items-center',
                                        `${
                                            project.id === Number(projectId)
                                                ? `bg-white border-b-2`
                                                : 'hover:bg-gray-100'
                                        }`,
                                    )}
                                    style={
                                        project.id === Number(projectId)
                                            ? {
                                                  borderColor: project.color,
                                                  color: project.color,
                                              }
                                            : { color: project.color }
                                    }
                                    onClick={() => navigate(`/project/${project.id}`)}
                                >
                                    <Folder className="h-4 w-4" />
                                    {project.title}
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

                <Outlet />
            </div>
        </PageAnimation>
    );
};

export default Project;
