import { ScrollArea } from '@/components/ui/scroll-area';
import WorkunitCard from '@/components/Session/SessionCard';
import { useSession, SessionWithTaskAndTag } from '@/hooks/useSession';
import { Outlet, useLocation } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Controls from '@/components/Session/Controls';
import SessionCard from '@/components/Session/SessionCard';

const Dashboard = () => {
    const { data: sessions, isLoading, error } = useSession();
    const location = useLocation();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.toString()}</div>;
    }

    return (
        <div className="flex h-full">
            <div className="h-full flex flex-col flex-1">
                <div className="flex items-center justify-between h-1/12">
                    <Controls />
                </div>

                <Separator className="mb-0" />

                <ScrollArea
                    className={cn(
                        'h-11/12',
                        location.pathname !== '/dashboard' && 'max-sm:hidden',
                        'max-md:w-full'
                    )}
                >
                    <ul className="flex flex-col gap-[1px] py-2">
                        {sessions &&
                            sessions.length > 0 &&
                            sessions.map(
                                (
                                    sessionWithTaskAndTag: SessionWithTaskAndTag,
                                    index: number
                                ) => (
                                    <SessionCard
                                        key={index}
                                        sessionWithTaskAndTag={
                                            sessionWithTaskAndTag
                                        }
                                    />
                                )
                            )}
                    </ul>
                </ScrollArea>
            </div>

            <ScrollArea key={location.pathname} className=" py-4">
                <motion.div
                    initial={
                        location.pathname === '/dashboard'
                            ? { width: 0, opacity: 0 }
                            : {}
                    }
                    animate={{ width: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Outlet />
                </motion.div>
            </ScrollArea>
        </div>
    );
};

export default Dashboard;
