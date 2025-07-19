import { Outlet } from 'react-router-dom';
import { useDb } from '../../hooks/useDb';
import { Toaster } from '../ui/sonner';
import ModalLayout from './ModalLayout';
import NeramSidebar from './NeramSidebar';
import TitleBar from './TitleBar';

export function AppLayout() {
    const { isLoading, error } = useDb();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.toString()}</div>;

    return (
        <div
            className="flex h-screen w-full fixed top-0"
            // onContextMenuCapture={(e) => e.preventDefault()}
        >
            <NeramSidebar />
            <Toaster position="bottom-center" richColors />
            <ModalLayout />
            <main className="flex flex-col text-foreground overflow-y-auto h-full w-full bg-gray-50">
                <div className="title-bar-height bg-white border-b-2 border-gray-100">
                    <TitleBar />
                </div>
                <div className="main-content-height w-full p-4">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
