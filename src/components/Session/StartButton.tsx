import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MinimalProject, useProject } from '@/hooks/useProject';
import { useCreateSession } from '@/hooks/useSession';
import { useTask } from '@/hooks/useTask';
import dayjs from 'dayjs';
import { Play } from 'lucide-react';

const StartButton = () => {
    const { data: projects } = useProject();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={'default'}
                    className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600"
                >
                    <Play fill="currentColor" className="w-4 h-4" />
                    <span>Start</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Projects</DropdownMenuLabel>
                <DropdownMenuGroup>
                    {projects?.length ? (
                        projects.map((project) => (
                            <TaskList key={project.id} project={project} />
                        ))
                    ) : (
                        <DropdownMenuItem disabled>
                            {' '}
                            No Projects{' '}
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const TaskList = ({ project }: { project: MinimalProject }) => {
    const { data: tasksForProject, isLoading } = useTask(project.id);
    const { mutate: createSession } = useCreateSession();

    if (isLoading) return <DropdownMenuItem>Loading...</DropdownMenuItem>;

    const startTimer = async (projectId: number, taskId: number) => {
        createSession({
            title: 'UNTITLED',
            project_id: projectId,
            task_id: taskId,
            date: dayjs().startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
            start_time: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
            session_duration_sec: 0,
            break_duration_sec: 0,
            tags: [],
        });
    };

    return (
        <DropdownMenuSub key={project.id}>
            <DropdownMenuSubTrigger>{project.title}</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    {tasksForProject?.length ? (
                        tasksForProject.map((task) => (
                            <DropdownMenuItem
                                key={task.id}
                                onClick={() => startTimer(project.id, task.id)}
                            >
                                {task.title}
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <DropdownMenuItem disabled>
                            No tasks yet
                        </DropdownMenuItem>
                    )}
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    );
};

export default StartButton;
