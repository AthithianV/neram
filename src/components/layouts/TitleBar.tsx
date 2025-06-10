import { getCurrentWindow } from '@tauri-apps/api/window';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Minimize from '../icon/Minimize';
import RestoreDown from '../icon/RestoreDown';
import Close from '../icon/Close';
import RestoreUp from '../icon/RestoreUp';
import { Link, useLocation } from 'react-router-dom';
import { capitalize } from '@/lib/textFormatter';

const TitleBar = () => {
    const [isMaximized, setIsMaximized] = useState(false);

    const { pathname } = useLocation();

    const breadcrumbItems = pathname
        .split('/')
        .filter((item) => item !== '' && isNaN(Number(item)))
        .map((item, index): { title: string; path: string } => {
            return {
                title: capitalize(item.replace(/-/g, ' ')),
                path: `${pathname
                    .split('/')
                    .slice(0, index + 2)
                    .join('/')}`,
            };
        });

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
            <div
                onMouseDown={handleStartDragging}
                className="w-full flex justify-between items-center h-full"
            >
                <Breadcrumb className="px-4">
                    <BreadcrumbList>
                        {breadcrumbItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2"
                            >
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <Link to={item.path}>{item.title}</Link>
                                </BreadcrumbItem>
                            </div>
                        ))}
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
