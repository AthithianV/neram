import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SessionGroupType } from '@/hooks/useSession';
import { Check, List } from 'lucide-react';

const groups: SessionGroupType[] = ['Date', 'Week', 'Month', 'Year'];

type PropType = {
    groupBy: string;
    setGroupBy: (group: SessionGroupType) => void;
};

const SessionFilter = ({ groupBy, setGroupBy }: PropType) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-semibold rounded-sm flex gap-1 items-center cursor-pointer p-2 hover:bg-gray-100">
                <List size={16} /> Group By
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
