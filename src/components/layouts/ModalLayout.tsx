import { MODALMODES, ModalModes } from '@/constants/modal';
import { TaskStatus } from '@/constants/task';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Skeleton } from '../ui/skeleton';

const ProjectForm = React.lazy(() => import('../project/ProjectForm'));
const SessionForm = React.lazy(() => import('../session/SessionForm'));
const TaskForm = React.lazy(() => import('../task/TaskForm'));

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, translateY: 20 },
    visible: { opacity: 1, translateY: 0 },
    exit: { opacity: 0, translateY: 20 },
};

export const ModalOverlay = ({ children }: { children: React.ReactNode }) => (
    <motion.div
        className="fixed inset-0 bg-gray-800/30 flex justify-center items-center z-50"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
    >
        <motion.div
            className={cn('bg-white py-10 px-20 rounded-lg')}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
            {children}
        </motion.div>
    </motion.div>
);

const ModalManager = ({ modal }: { modal: ModalModes }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const closeModal = () =>
        setSearchParams((params) => {
            params.delete('modal');
            params.delete('id');
            return params;
        });

    const idParam = searchParams.get('id');
    const id = idParam !== null ? Number(idParam) : null;

    const taskStatus = searchParams.get('task_status');

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    switch (modal) {
        case 'add_project':
            return (
                <Suspense fallback={<Skeleton className="h-100 w-100" />}>
                    <ProjectForm closeModal={closeModal} />
                </Suspense>
            );
        case 'edit_project':
            return (
                <Suspense fallback={<Skeleton className="h-100 w-100" />}>
                    <ProjectForm projectId={id} closeModal={closeModal} />
                </Suspense>
            );
        case 'add_task':
            return (
                <Suspense fallback={<Skeleton className="h-100 w-100" />}>
                    <TaskForm closeModal={closeModal} status={taskStatus as TaskStatus} />
                </Suspense>
            );
        case 'edit_task':
            return (
                <Suspense fallback={<Skeleton className="h-100 w-100" />}>
                    <TaskForm
                        closeModal={closeModal}
                        status={taskStatus as TaskStatus}
                        taskId={id}
                    />
                </Suspense>
            );
        case 'add_session':
            return (
                <Suspense fallback={<Skeleton className="h-100 w-100" />}>
                    <SessionForm closeModal={closeModal} />
                </Suspense>
            );
        case 'edit_session':
            return (
                <Suspense fallback={<Skeleton className="h-100 w-100" />}>
                    <SessionForm sessionId={id} closeModal={closeModal} />
                </Suspense>
            );
        default:
            return null;
    }
};

const ModalLayout = () => {
    const [searchParams] = useSearchParams();
    const rawModal = searchParams.get('modal');
    const modal: ModalModes | null =
        rawModal && MODALMODES.includes(rawModal as ModalModes)
            ? (rawModal as ModalModes)
            : null;

    return (
        <AnimatePresence>
            {modal && (
                <ModalOverlay>
                    <ModalManager modal={modal} />
                </ModalOverlay>
            )}
        </AnimatePresence>
    );
};

export default ModalLayout;
