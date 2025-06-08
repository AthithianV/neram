import { getCurrentWindow } from '@tauri-apps/api/window';
import { Button } from '../ui/button';
import { Square } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Minimize from '../icon/Minimize';
import RestoreDown from '../icon/RestoreDown';
import Close from '../icon/Close';
import RestoreUp from '../icon/RestoreUp';

const TitleBar = () => {
    const [isMaximized, setIsMaximized] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const setupWindow = async () => {
            const appWindow = getCurrentWindow();

            // Check initial maximized state
            const maximized = await appWindow.isMaximized();
            setIsMaximized(maximized);

            // Listen for resize events
            const unlisten = await appWindow.onResized(() => {
                appWindow.isMaximized().then((maximized) => {
                    setIsMaximized(maximized);
                });
            });

            return () => {
                unlisten();
            };
        };

        setupWindow();
    }, []);

    const handleMinimize = async () => {
        const appWindow = getCurrentWindow();
        await appWindow.minimize();
    };

    const handleMaximize = async () => {
        const appWindow = getCurrentWindow();
        await appWindow.toggleMaximize();
    };

    const handleClose = async () => {
        const appWindow = getCurrentWindow();
        await appWindow.close();
    };

    const handleStartDragging = async (e: React.MouseEvent) => {
        // Prevent dragging when clicking buttons
        if ((e.target as HTMLElement).closest('button')) {
            return;
        }

        const appWindow = getCurrentWindow();
        await appWindow.startDragging();
    };

    return (
        <div className="w-full h-full flex flex-col items-center">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 text-xs">
                    Error: {error}
                </div>
            )}
            <div
                onMouseDown={handleStartDragging}
                className="w-full flex justify-between items-center h-full"
            >
                <Breadcrumb className="px-4">
                    <BreadcrumbList>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex items-center h-full">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="px-6 h-full rounded-none"
                        onClick={handleMinimize}
                    >
                        <Minimize />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="px-6 h-full rounded-none"
                        onClick={handleMaximize}
                    >
                        {isMaximized ? <RestoreDown /> : <RestoreUp />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="px-6 h-full rounded-none hover:bg-red-500"
                        onClick={handleClose}
                    >
                        <Close />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TitleBar;
