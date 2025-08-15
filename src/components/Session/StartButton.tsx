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
import { useStartTimer, useTimer } from '@/hooks/useTimer';
import { Play } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const StartButton = () => {
    const { data: projects } = useProject();

    const { data: timer } = useTimer();
    const { mutateAsync: startTimer } = useStartTimer();

    const handleStart = async (projectId: number) => {
        await startTimer({
            timerData: {
                timerType: 'Session',
                projectId: Number(projectId),
            },
            shouldCreateSession: true,
            sessionData: { title: `Untitled` },
        });
    };

    if (!timer) {
        return <Skeleton />;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={'default'}
                    className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white"
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
