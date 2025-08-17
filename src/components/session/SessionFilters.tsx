import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SessionGroupType } from '@/hooks/useSession';
import { Check, Component } from 'lucide-react';

const groups: SessionGroupType[] = ['Date', 'Week', 'Month', 'Year'];

type PropType = {
    groupBy: string;
    setGroupBy: (group: SessionGroupType) => void;
};

const SessionFilter = ({ groupBy, setGroupBy }: PropType) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="px-4 py-2 text-sm rounded-sm flex gap-1 items-center">
                <Component size={15} /> Group By
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {groups.map((currentGroup, index) => (
                    <DropdownMenuItem
                        key={index}
                        onClick={() => setGroupBy(currentGroup)}
                    >
                        {groupBy === currentGroup && <Check />}
                        {currentGroup}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SessionFilter;
