import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProject } from '@/hooks/useProject';
import { useCreateSession } from '@/hooks/useSession';
import { useStartTimer, useTimer } from '@/hooks/useTimer';
import dayjs from 'dayjs';
import { Play } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const StartButton = () => {
    const { data: projects } = useProject();

    const { data: timer } = useTimer();
    const { mutateAsync: createSession } = useCreateSession();
    const { mutateAsync: startTimer } = useStartTimer();

    const handleStart = async (projectId: number) => {
        const id = await createSession({
            title: 'UNTITLED',
            project_id: projectId,
            date: dayjs().startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
            start_time: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
            session_duration_sec: 0,
            break_duration_sec: 0,
            tags: [],
        });
        await startTimer({ sessionId: id });
    };

    if (!timer) {
        return <Skeleton />;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={'default'}
                    className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600"
                    disabled={timer.timer > 0 && timer.timer_type !== 'Session'}
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
                            <DropdownMenuItem
                                onPointerDown={(e) => {
                                    e.stopPropagation();
                                    handleStart(project.id);
                                }}
                                key={project.id}
                            >
                                {project.title}
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <DropdownMenuItem disabled> No Projects </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default StartButton;
