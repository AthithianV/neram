import { Workunit } from '@/schema/WorkunitSchema';
import { formatTime } from '@/lib/time';
import { Badge } from '@/components/ui/badge';
import React from 'react';

interface WorkunitCardProps extends React.LiHTMLAttributes<HTMLLIElement> {
    workunit: Workunit;
}

const WorkunitCard = React.forwardRef<HTMLLIElement, WorkunitCardProps>(
    ({ workunit, className, children, ...props }, ref) => {
        return (
            <li
                ref={ref}
                className={`flex items-center justify-between px-4 py-2 border bg-white shadow rounded-md cursor-pointer hover:bg-gray-50 ${
                    className || ''
                }`}
                {...props}
            >
                <div className="flex flex-col gap-2">
                    <h3 className="text-md font-semibold">{workunit.task}</h3>
                    <ul className="flex flex-wrap gap-2">
                        {workunit.tags && workunit.tags.length > 0 ? (
                            workunit.tags.map((tag) => (
                                <li key={tag} className="text-sm text-gray-500">
                                    <Badge>{tag}</Badge>
                                </li>
                            ))
                        ) : (
                            <li className="text-sm text-gray-500 opacity-40">
                                No tags
                            </li>
                        )}
                    </ul>
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
