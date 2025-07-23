import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useProject } from '@/hooks/useProject';
import { cn } from '@/lib/utils';
import { Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import PageAnimation from '@/components/layouts/PageAnimation';
import ProjectSettings from '@/components/project/ProjectSettings';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const Project = () => {
    const [_, setSearchParams] = useSearchParams();
    const { data: projects } = useProject();
    const { projectId } = useParams();
    const navigate = useNavigate();

    const handleAdd = async () => {
        if (projects && projects.length >= 5) {
            toast.warning('Cannot Add more than 5 Projects');
            return;
        }
        setSearchParams({ modal: 'add_project' });
    };

    return (
        <PageAnimation>
            <div className="h-full">
                <div className="flex items-center gap-2 h-[var(--project-tab-height)]">
                    <ScrollArea className="max-w-[92%] max-xl:max-w-[88%] max-lg:max-w-[82%] max-md:max-w-[80%]  whitespace-nowrap">
                        <div className="flex gap-1 pb-3">
                            {projects?.map((project) => (
                                <div
                                    key={project.id}
                                    className={cn(
                                        `py-2 px-4 rounded cursor-pointer text-sm bg-gray-100 min-w-fit`,
                                        `${
                                            project.id === Number(projectId)
                                                ? `bg-white border-b-2`
                                                : ''
                                        }`,
                                        'flex gap-2 items-center',
                                    )}
                                    style={
                                        project.id === Number(projectId)
                                            ? {
                                                  borderColor: project.color,
                                                  color: project.color,
                                              }
                                            : {}
                                    }
                                    onClick={() => navigate(`/project/${project.id}`)}
                                >
                                    {project.title}
                                </div>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>

                    <Button
                        className="mb-3 cursor-pointer"
                        variant={'outline'}
                        onClick={handleAdd}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                    <ProjectSettings />
                </div>
                <div className="h-[var(--kanban-height)]">
                    <Outlet />
                </div>
            </div>
        </PageAnimation>
    );
};

export default Project;
