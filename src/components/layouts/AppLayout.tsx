import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { useDb } from '../../hooks/useDb';
import { Skeleton } from '../ui/skeleton';
import { Toaster } from '../ui/sonner';

const ModalLayout = React.lazy(() => import('./ModalLayout'));
const NeramSidebar = React.lazy(() => import('./NeramSidebar'));
const TitleBar = React.lazy(() => import('./TitleBar'));

export function AppLayout() {
    const { isLoading, error } = useDb();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.toString()}</div>;

    return (
        <div className="flex h-screen w-full fixed top-0 overflow-hidden">
            <Suspense fallback={<Skeleton className="h-full" />}>
                <NeramSidebar />
            </Suspense>
            <Toaster position="bottom-center" richColors />
            <Suspense fallback={<Skeleton />}>
                <ModalLayout />
            </Suspense>

            <main className="flex flex-col text-foreground overflow-hidden h-full w-full bg-gray-50">
                <div className="title-bar-height bg-white border-b-2 border-gray-100">
                    <Suspense fallback={<Skeleton className="title-bar-height w-full" />}>
                        <TitleBar />
                    </Suspense>
                </div>
                <Outlet />
            </main>
        </div>
    );
}
