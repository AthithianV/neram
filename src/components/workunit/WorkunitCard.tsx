import { formatTime } from '@/lib/time';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import { WorkunitWithTaskAndTag } from '@/hooks/useWorkunit';

interface WorkunitCardProps extends React.LiHTMLAttributes<HTMLLIElement> {
    workunitWithTaskAndTag: WorkunitWithTaskAndTag;
}

const WorkunitCard = React.forwardRef<HTMLLIElement, WorkunitCardProps>(
    ({ workunitWithTaskAndTag, className, children, ...props }, ref) => {
        if (!workunitWithTaskAndTag) {
            return null;
        }

        const { workunit, task, tags } = workunitWithTaskAndTag;

        return (
            <li
                ref={ref}
                className={`flex items-center justify-between px-4 py-2 border bg-white shadow rounded-md cursor-pointer hover:bg-gray-50 ${
                    className || ''
                }`}
                {...props}
            >
                <div className="flex items-center gap-4">
                    <div
                        className="p-2 rounded-md"
                        style={{ backgroundColor: task.color }}
                    ></div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-md font-semibold">{task.title}</h3>
                        <ul className="flex flex-wrap gap-2">
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
                    </div>
                </div>
                <div>
                    <p className="text-sm text-gray-500">
                        {formatTime(workunit.session_duration)}
                    </p>
                </div>
            </li>
        );
    }
);

WorkunitCard.displayName = 'WorkunitCard';

export default WorkunitCard;
