import { MODALMODES, ModalModes } from '@/constants/modal';
import { TaskStatus } from '@/constants/task';
import { cn } from '@/lib/utils';
import React, { Suspense, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoaderWrapper from './Loader';
import { useModalClose } from '@/hooks/useModalClose';

const ProjectForm = React.lazy(() => import('../project/ProjectForm'));
const SessionForm = React.lazy(() => import('../session/SessionForm'));
const TaskForm = React.lazy(() => import('../task/TaskForm'));

// 🔹 Overlay component
export const ModalOverlay = ({
    children,
    closeModal,
}: {
    children: React.ReactNode;
    closeModal: () => void;
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    useModalClose(modalRef, closeModal);

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50">
            <div ref={modalRef} className={cn('shadow-lg')}>
                {children}
            </div>
        </div>
    );
};

const ModalManager = ({
    modal,
    closeModal,
}: {
    modal: ModalModes;
    closeModal: () => void;
}) => {
    const [searchParams] = useSearchParams();
    const idParam = searchParams.get('id');
    const id = idParam !== null ? Number(idParam) : null;
    const taskStatus = searchParams.get('task_status');

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
                    <TaskForm
                        closeModal={closeModal}
                        status={taskStatus as TaskStatus}
                    />
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
    const [searchParams, setSearchParams] = useSearchParams();
    const rawModal = searchParams.get('modal');
    const modal: ModalModes | null =
        rawModal && MODALMODES.includes(rawModal as ModalModes)
            ? (rawModal as ModalModes)
            : null;

    const closeModal = () =>
        setSearchParams((params) => {
            params.delete('modal');
            params.delete('id');
            return params;
        });

    return (
        modal && (
            <ModalOverlay closeModal={closeModal}>
                <ModalManager modal={modal} closeModal={closeModal} />
            </ModalOverlay>
        )
    );
};

export default ModalLayout;
