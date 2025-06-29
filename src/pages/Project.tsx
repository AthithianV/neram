import { useProject } from '@/hooks/useProject';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Project as ProjectType } from '@/schema/ProjectSchema';
import { cn } from '@/lib/utils';
import { Outlet, useNavigate } from 'react-router-dom';

const Project = () => {
    const { data: projects, isLoading, error } = useProject();
    const navigate = useNavigate();
    const [currentProject, setCurrentProject] = useState<ProjectType | null>(
        null
    );

    useEffect(() => {
        if (projects) {
            setCurrentProject(projects[0]);
        }
    }, [projects]);

    return (
        <div className="h-full">
            <ul className="flex border-b-2 items-center">
                {projects?.map((project) => (
                    <li
                        key={project.id}
                        className={cn(
                            `py-2 px-4 rounded-xs cursor-pointer text-sm`,
                            `${
                                currentProject?.id === project.id
                                    ? 'bg-white border-b-2'
                                    : ''
                            }`
                        )}
                        style={{
                            borderColor: project.color,
                        }}
                        onClick={() => navigate(`/project/${project.id}`)}
                    >
                        {project.title}
                    </li>
                ))}
                <li className="py-2 px-4 rounded-sm  cursor-pointer">
                    <Plus className="w-4 h-4" />
                </li>
            </ul>
            <Outlet />
        </div>
    );
};

export default Project;
