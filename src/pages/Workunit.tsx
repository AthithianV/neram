import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import WorkunitCard from '@/components/workunit/WorkunitCard';
import { PlayIcon, PlusIcon } from 'lucide-react';
import { useWorkunit, WorkunitWithTaskAndTag } from '@/hooks/useWorkunit';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Controls from '@/components/workunit/Controls';

const Dashboard = () => {
    const { data: workunits, isLoading, error } = useWorkunit();
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
                        {workunits &&
                            workunits.length > 0 &&
                            workunits.map(
                                (
                                    workunitWithTaskAndTag: WorkunitWithTaskAndTag,
                                    index: number
                                ) => (
                                    <WorkunitCard
                                        key={index}
                                        workunitWithTaskAndTag={
                                            workunitWithTaskAndTag
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
