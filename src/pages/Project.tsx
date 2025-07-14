import { useProject } from '@/hooks/useProject';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Outlet, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogHeader,
} from '@/components/ui/dialog';
import { ProjectForm } from '@/components/project/ProjectForm';

const Project = () => {
    const { data: projects } = useProject();
    const { projectId } = useParams();
    const navigate = useNavigate();

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
                                        project.id === Number(projectId)
                                            ? `bg-white border-b-2`
                                            : ''
                                    }`,
                                )}
                                style={
                                    project.id === Number(projectId)
                                        ? {
                                              borderColor: project.color,
                                              color: project.color,
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

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="mb-3 cursor-pointer">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[50vw] h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>Create project</DialogTitle>
                            <DialogDescription>
                                Create a new project.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[90%] pe-3">
                            <ProjectForm />
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    );
};

export default Project;
