import { Outlet } from 'react-router-dom';
import NeramSidebar from './NeramSidebar';
import { Toaster } from '../ui/sonner';
import { useDb } from '../../hooks/useDb';
import TitleBar from './TitleBar';

export function AppLayout() {
    const { isLoading, error } = useDb();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.toString()}</div>;

    return (
        <div className="flex h-screen w-full fixed top-0">
            <NeramSidebar />
            <Toaster />
            <main className="flex flex-col text-foreground overflow-y-auto h-full w-full bg-gray-50">
                <div className="h-[6%] bg-white border-b-2 border-gray-100">
                    <TitleBar />
                </div>
                <div className="h-[94%] w-full p-4">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
