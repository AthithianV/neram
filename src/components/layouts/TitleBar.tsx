import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

import { useStopTimer } from '@/hooks/useTimer';
import Close from '../icons/Close';
import Minimize from '../icons/Minimize';
import RestoreDown from '../icons/RestoreDown';
import RestoreUp from '../icons/RestoreUp';

const TitleBar = () => {
    const [isMaximized, setIsMaximized] = useState(false);
    const { mutateAsync: stopTimer } = useStopTimer();

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
        await stopTimer();
        const appWindow = getCurrentWindow();
        await appWindow.close();
    };

    const handleStartDragging = async (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('button')) {
            return;
        }

        const appWindow = getCurrentWindow();
        await appWindow.startDragging();
    };

    return (
        <div className="w-full h-full flex flex-col items-center bg-sidebar">
            <div
                onMouseDown={handleStartDragging}
                className="w-full flex justify-end items-center h-full"
            >
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
                        className="px-6 h-full rounded-none hover:bg-red-500 dark:hover:bg-red-800"
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
