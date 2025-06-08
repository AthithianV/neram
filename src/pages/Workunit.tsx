import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import WorkunitCard from '@/components/workunit/WorkunitCard';
import { PlayIcon, PlusIcon } from 'lucide-react';
import { useWorkunit, WorkunitWithTaskAndTag } from '@/hooks/useWorkunit';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
        <div className="flex flex-col h-full overflow-x-hidden">
            <div className="flex items-center justify-between h-1/12">
                <div className="flex gap-2">
                    <Button
                        variant={'default'}
                        className="flex items-center gap-1"
                    >
                        <PlayIcon fill="currentColor" className="w-4 h-4" />
                        <span>Start</span>
                    </Button>
                    <Link to="/dashboard/add-workunit">
                        <Button
                            variant={'default'}
                            className="flex items-center gap-1"
                        >
                            <PlusIcon fill="currentColor" className="w-4 h-4" />
                            <span>Add Work Unit</span>
                        </Button>
                    </Link>
                </div>
            </div>

            <Separator className="mb-0" />

            <div className="h-11/12 flex w-full overflow-x-hidden">
                <ScrollArea
                    className={cn(
                        'h-full flex-1',
                        location.pathname !== '/dashboard' && 'max-sm:hidden',
                        'max-md:w-full'
                    )}
                >
                    <ul className="flex flex-col gap-[1px]">
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

                <ScrollArea
                    key={location.pathname}
                    className="scrollbar-hidden py-4"
                >
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default Dashboard;
