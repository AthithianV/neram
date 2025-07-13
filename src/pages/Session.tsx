import { Outlet, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Controls from '@/components/session/Controls';
import SessionCard from '@/components/session/SessionCard';

import { useSession } from '@/hooks/useSession';

import { cn } from '@/lib/utils';

const Session = () => {
    const { data: sessions, isLoading, error } = useSession();
    const location = useLocation();
    const { sessionId } = useParams();

    const isEditMode = !!sessionId || location.pathname.includes('add-session');

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.toString()}</div>;

    return (
        <div className="flex h-full w-full overflow-hidden">
            <motion.div
                initial={{ flex: 1 }}
                animate={{ flex: isEditMode ? 0.6 : 1 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
                <div className="flex items-center justify-between h-1/12">
                    <Controls />
                </div>
                <Separator className="mb-0" />
                <ScrollArea
                    className={cn(
                        'h-11/12',
                        location.pathname !== '/dashboard' && 'max-sm:hidden',
                        'max-md:w-full',
                    )}
                >
                    <ul className="flex flex-col py-2">
                        {sessions?.map((sessionWithTaskAndTag, index) => (
                            <SessionCard
                                key={index}
                                sessionWithTaskAndTag={sessionWithTaskAndTag}
                            />
                        ))}
                    </ul>
                </ScrollArea>
            </motion.div>

            <AnimatePresence mode="wait">
                {isEditMode && (() => console.log('Edit mode')) && (
                    <motion.div
                        key={'sessionId'}
                        initial={{ flex: 0, opacity: 0 }}
                        animate={{ flex: 0.4, opacity: 1 }}
                        exit={{ flex: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="h-full shadow-lg overflow-y-auto"
                    >
                        <ScrollArea className="h-full">
                            <Outlet />
                        </ScrollArea>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Session;
