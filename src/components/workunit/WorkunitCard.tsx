import { formatTime } from '@/lib/time';
import { Badge } from '@/components/ui/badge';
import { WorkunitWithTaskAndTag } from '@/hooks/useWorkunit';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

interface WorkunitCardProps {
    workunitWithTaskAndTag: WorkunitWithTaskAndTag;
}

const WorkunitCard = ({ workunitWithTaskAndTag }: WorkunitCardProps) => {
    const { workunitId } = useParams();
    const navigate = useNavigate();
    const { workunit, task, tags } = workunitWithTaskAndTag;

    return (
        <li
            className={cn(
                'flex items-center justify-between',
                'px-4 py-2 border shadow rounded-md cursor-pointer',
                'bg-white',
                workunit.id === parseInt(workunitId || '0')
                    ? 'bg-gray-100'
                    : 'hover:bg-gray-50'
            )}
            onClick={() => {
                navigate(`update-workunit/${workunit.id}`);
            }}
        >
            <div className="flex items-center gap-4 flex-1">
                <div
                    className="p-2 rounded-md"
                    style={{ backgroundColor: task?.color || '#F3F4F6' }}
                ></div>
                <div className="flex flex-col gap-2 flex-1">
                    <h3 className="text-md font-semibold">
                        {task?.title || 'Untitled'}
                    </h3>
                    <ScrollArea className="max-w-5/6">
                        <ul className="flex gap-2">
                            {tags && tags.length > 0 ? (
                                tags.map((tag) => (
                                    <li
                                        key={tag.title}
                                        className="text-sm text-gray-500"
                                    >
                                        <Badge
                                            style={{
                                                backgroundColor: tag.color,
                                            }}
                                        >
                                            {tag.title}
                                        </Badge>
                                    </li>
                                ))
                            ) : (
                                <li className="text-sm text-gray-500 opacity-40">
                                    <Badge className="bg-gray-200 text-gray-500">
                                        No tags
                                    </Badge>
                                </li>
                            )}
                        </ul>
                        <ScrollBar orientation="horizontal" hidden/>
                    </ScrollArea>
                </div>
            </div>
            <div>
                <p className="text-sm text-gray-500">
                    {formatTime(workunit.session_duration)}
                </p>
            </div>
        </li>
    );
};

export default WorkunitCard;
