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
            <DropdownMenuTrigger className="px-4 py-2 text-sm font-semibold rounded-sm flex gap-1 items-center border">
                <Component size={12} /> Group By
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {groups.map((currentGroup, index) => (
                    <DropdownMenuItem
                        key={index}
                        onClick={() => setGroupBy(currentGroup)}
                        className="flex justify-between"
                    >
                        {currentGroup}
                        {groupBy === currentGroup && <Check />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SessionFilter;
