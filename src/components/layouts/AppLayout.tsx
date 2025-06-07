import { Outlet } from 'react-router-dom';
import Sidebar from './NeramSidebar';
import { Toaster } from '../ui/sonner';
import { useDb } from '../../hooks/useDb';
import { useEffect } from 'react';

export function AppLayout() {
    const { data, isLoading, error } = useDb();

    useEffect(() => {
        console.log(data);
    }, [data]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.toString()}</div>;

    return (
        <div className="flex h-screen w-full">
            <Sidebar />
            <Toaster />
            <main className="flex-1 text-foreground p-4 overflow-y-auto h-full bg-main">
                <Outlet />
            </main>
        </div>
    );
}
