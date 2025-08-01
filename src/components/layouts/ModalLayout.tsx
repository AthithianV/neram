import { MODALMODES, ModalModes } from '@/constants/modal';
import { TaskStatus } from '@/constants/task';
import { cn } from '@/lib/utils';
import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoaderWrapper from './Loader';

const ProjectForm = React.lazy(() => import('../project/ProjectForm'));
const SessionForm = React.lazy(() => import('../session/SessionForm'));
const TaskForm = React.lazy(() => import('../task/TaskForm'));

export const ModalOverlay = ({ children }: { children: React.ReactNode }) => (
    <div className="fixed inset-0 bg-gray-800/30 flex justify-center items-center z-50">
        <div className={cn('')}>{children}</div>
    </div>
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
                <Suspense fallback={<LoaderWrapper />}>
                    <ProjectForm closeModal={closeModal} />
                </Suspense>
            );
        case 'edit_project':
            return (
                <Suspense fallback={<LoaderWrapper />}>
                    <ProjectForm projectId={id} closeModal={closeModal} />
                </Suspense>
            );
        case 'add_task':
            return (
                <Suspense fallback={<LoaderWrapper />}>
                    <TaskForm closeModal={closeModal} status={taskStatus as TaskStatus} />
                </Suspense>
            );
        case 'edit_task':
            return (
                <Suspense fallback={<LoaderWrapper />}>
                    <TaskForm
                        closeModal={closeModal}
                        status={taskStatus as TaskStatus}
                        taskId={id}
                    />
                </Suspense>
            );
        case 'add_session':
            return (
                <Suspense fallback={<LoaderWrapper />}>
                    <SessionForm closeModal={closeModal} />
                </Suspense>
            );
        case 'edit_session':
            return (
                <Suspense fallback={<LoaderWrapper />}>
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
        modal && (
            <ModalOverlay>
                <ModalManager modal={modal} />
            </ModalOverlay>
        )
    );
};

export default ModalLayout;
