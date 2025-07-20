import { MODALMODES, ModalModes } from '@/constants/modal';
import { TaskStatus } from '@/constants/task';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProjectForm from '../project/ProjectForm';
import SessionForm from '../session/SessionForm';
import TaskForm from '../task/TaskForm';

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, translateY: 20 },
    visible: { opacity: 1, translateY: 0 },
    exit: { opacity: 0, translateY: 20 },
};

export const ModalOverlay = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className: string;
}) => (
    <motion.div
        className="fixed inset-0 bg-gray-800/30 flex justify-center items-center z-50"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
    >
        <motion.div
            className={cn('bg-white py-10 px-20 rounded-lg', className)}
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
            return <ProjectForm closeModal={closeModal} />;
        case 'edit_project':
            return <ProjectForm projectId={id} closeModal={closeModal} />;
        case 'add_task':
            return <TaskForm closeModal={closeModal} status={taskStatus as TaskStatus} />;
        case 'edit_task':
            return (
                <TaskForm closeModal={closeModal} status={taskStatus as TaskStatus} taskId={id} />
            );
        case 'add_session':
            return <SessionForm closeModal={closeModal} />;
        case 'edit_session':
            return <SessionForm sessionId={id} closeModal={closeModal} />;
        default:
            return null;
    }
};

const ModalLayout = () => {
    const [searchParams] = useSearchParams();
    const rawModal = searchParams.get('modal');
    const modal: ModalModes | null =
        rawModal && MODALMODES.includes(rawModal as ModalModes) ? (rawModal as ModalModes) : null;

    return (
        <AnimatePresence>
            {modal && (
                <ModalOverlay className={'w-[50vw]'}>
                    <ModalManager modal={modal} />
                </ModalOverlay>
            )}
        </AnimatePresence>
    );
};

export default ModalLayout;
