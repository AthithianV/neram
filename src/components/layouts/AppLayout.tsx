import { useUpdateIncompleteSession } from '@/hooks/useSession';
import { useUpdater } from '@/hooks/useUpdater';
import React, { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDb } from '../../hooks/useDb';
import { ThemeProvider } from '../theme/ThemeProvider';
import { Skeleton } from '../ui/skeleton';
import { Toaster } from '../ui/sonner';
import { ToastContainer, toast } from 'react-toastify';
import DonateToast from '../about/DonateToast';
import UpdateToast from '../update/UpdateToast';

const ModalLayout = React.lazy(() => import('./ModalLayout'));
const NeramSidebar = React.lazy(() => import('./NeramSidebar'));
const TitleBar = React.lazy(() => import('./TitleBar'));

export function AppLayout() {
    const { isLoading, error } = useDb();
    useUpdater();

    const { mutateAsync: updateIncompleteSession } =
        useUpdateIncompleteSession();

    useEffect(() => {
        updateIncompleteSession();
    }, [isLoading]);

    useEffect(() => {
        toast(DonateToast, {
            className:
                '!p-0 border border-gray-700 shadow-lg bg-background opacity-100',
            hideProgressBar: true,
            pauseOnHover: true,
            autoClose: false,
        });

        toast(<UpdateToast />, {
            className:
                '!p-0 border border-gray-700 shadow-lg bg-background opacity-100',
            autoClose: false,
            hideProgressBar: true,
            pauseOnHover: false,
            closeOnClick: false,
        });
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.toString()}</div>;

    return (
        <ThemeProvider>
            <div className="flex h-screen w-full fixed top-0 overflow-hidden">
                <Suspense fallback={<Skeleton className="h-full" />}>
                    <NeramSidebar />
                </Suspense>
                <Toaster position="bottom-center" richColors />
                <Suspense fallback={<Skeleton />}>
                    <ModalLayout />
                </Suspense>

                <main className="flex flex-col text-foreground overflow-hidden h-full w-full">
                    <div className="title-bar-height bg-background border-border">
                        <Suspense
                            fallback={
                                <Skeleton className="title-bar-height w-full" />
                            }
                        >
                            <TitleBar />
                        </Suspense>
                    </div>
                    <Outlet />
                </main>
                <ToastContainer
                    position="bottom-right"
                    style={{ padding: '0px' }}
                />
            </div>
        </ThemeProvider>
    );
}
