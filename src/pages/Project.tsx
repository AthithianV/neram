import { useProject } from '@/hooks/useProject';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Project as ProjectType } from '@/schema/ProjectSchema';
import { cn } from '@/lib/utils';
import { Outlet, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const Project = () => {
    const { data: projects } = useProject();
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [currentProject, setCurrentProject] = useState<ProjectType | null>(
        null,
    );

    useEffect(() => {
        if (projects) {
            setCurrentProject(null);
        }
    }, [projects]);

    return (
        <div className="h-full">
            <div className="flex border-b-2 items-center gap-2">
                <ScrollArea className="w-[95%] whitespace-nowrap">
                    <div className="flex gap-1 pb-3">
                        {projects?.map((project) => (
                            <div
                                key={project.id}
                                className={cn(
                                    `py-2 px-4 rounded cursor-pointer text-sm bg-gray-100 min-w-fit`,
                                    `${
                                        currentProject?.id === project.id
                                            ? 'bg-white border-b-2'
                                            : ''
                                    }`,
                                )}
                                style={
                                    project.id === Number(projectId)
                                        ? {
                                              backgroundColor: project.color,
                                          }
                                        : {}
                                }
                                onClick={() =>
                                    navigate(`/project/${project.id}`)
                                }
                            >
                                {project.title}
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <div className="py-2 px-4 mb-2 rounded-sm hover:bg-gray-100 cursor-pointer">
                    <Plus className="w-4 h-4" />
                </div>
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    );
};

export default Project;
