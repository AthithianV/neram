// components/workunit/WorkunitCard.tsx
import { Workunit } from '@/schema/WorkunitSchema';
import { formatTime } from '@/lib/time';
import { Badge } from '@/components/ui/badge';
import React from 'react';

// 1. Define the props for WorkunitCard, including standard HTML li props
interface WorkunitCardProps extends React.LiHTMLAttributes<HTMLLIElement> {
    workunit: Workunit;
    // Add any other specific props WorkunitCard needs
}

// 2. Use React.forwardRef and destructure `className` and `...props`
const WorkunitCard = React.forwardRef<HTMLLIElement, WorkunitCardProps>(
    ({ workunit, className, children, ...props }, ref) => {
        // <--- Add `className` and `...props` here
        return (
            <li
                ref={ref}
                // Combine your fixed classes with the passed className for flexibility
                className={`flex items-center justify-between px-4 py-2 border bg-white shadow rounded-md cursor-pointer hover:bg-gray-50 ${
                    className || ''
                }`}
                {...props} // <--- IMPORTANT: Spread all other props here (including onClick)
            >
                <div className="flex flex-col gap-2">
                    <h3 className="text-md font-semibold">{workunit.task}</h3>
                    <ul className="flex flex-wrap gap-2">
                        {workunit.tags.length > 0 ? (
                            workunit.tags.map((tag) => (
                                <li key={tag} className="text-sm text-gray-500">
                                    <Badge>{tag}</Badge>
                                </li>
                            ))
                        ) : (
                            <li className="text-sm text-gray-500 opacity-40">No tags</li>
                        )}
                    </ul>
                </div>
                <div>
                    <p className="text-sm text-gray-500">
                        {formatTime(workunit.duration)}
                    </p>
                </div>
            </li>
        );
    }
);

WorkunitCard.displayName = 'WorkunitCard';

export default WorkunitCard;
