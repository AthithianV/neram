import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Settings, Trash } from 'lucide-react';

const ProjectSettings = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button className="mb-3 cursor-pointer" variant={'outline'}>
                    <Settings className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side={'bottom'} align="end">
                <DropdownMenuLabel>Project</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                    <Edit />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                    <Trash />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProjectSettings;
