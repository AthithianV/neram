import { usePomodoroSettings } from '@/hooks/usePomodoro';
import { Coffee } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const SessionsBar = () => {
    const { data: pomodoroSettings } = usePomodoroSettings();

    if (!pomodoroSettings) {
        return <Skeleton className="h-5" />;
    }

    const { session_count, session_completed, break_completed } = pomodoroSettings;

    return (
        <ul className="w-8/12 flex-center gap-2">
            {Array.from({ length: 2 * session_count - 1 }).map((_, index) => {
                const bgColor =
                    index % 2 === 0
                        ? Math.floor(index / 2) + 1 <= session_completed
                            ? 'bg-[#ff6347]'
                            : 'bg-gray-300'
                        : '';
                const textColor =
                    Math.floor(index / 2) + 1 <= break_completed
                        ? 'text-emerald-400'
                        : 'text-gray-300';
                return (
                    <li
                        className={`py-[1.5px] rounded-full ${index % 2 === 0 ? 'flex-1' : ''} ${bgColor} ${textColor}`}
                        key={index}
                    >
                        {index % 2 === 1 && <Coffee />}
                    </li>
                );
            })}
        </ul>
    );
};

export default SessionsBar;
