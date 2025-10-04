import { platform } from '@tauri-apps/plugin-os';
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
    const [os, setOs] = useState<string | null>(null);
    const { mutateAsync: stopTimer } = useStopTimer();

    useEffect(() => {
        const init = async () => {
            const appWindow = getCurrentWindow();
            setOs(platform());

            const maximized = await appWindow.isMaximized();
            setIsMaximized(maximized);

            const unlisten = await appWindow.onResized(() => {
                appWindow.isMaximized().then((max) => setIsMaximized(max));
            });

            return () => {
                unlisten();
            };
        };

        init();
    }, []);

    const handleMinimize = async () => {
        await getCurrentWindow().minimize();
    };

    const handleMaximize = async () => {
        await getCurrentWindow().toggleMaximize();
    };

    const handleClose = async () => {
        await stopTimer();
        await getCurrentWindow().close();
    };

    const handleStartDragging = async (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('button')) return;
        await getCurrentWindow().startDragging();
    };

    const isMac = os === 'darwin';

    return (
        <div className="w-full h-full flex flex-col items-center bg-sidebar select-none">
            <div
                onMouseDown={handleStartDragging}
                className={`w-full flex h-full justify-end items-center`}
            >
                <div className="flex items-center h-full gap-2">
                    {isMac ? (
                        <div className=" pe-5">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 rounded-full bg-yellow-400 hover:bg-yellow-500 p-0"
                                onClick={handleMinimize}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 rounded-full bg-green-500 hover:bg-green-600 p-0"
                                onClick={handleMaximize}
                            />
                            {/* macOS style: red, yellow, green on the left */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 rounded-full bg-red-500 hover:bg-red-600 p-0"
                                onClick={handleClose}
                            />
                        </div>
                    ) : (
                        <>
                            {/* Windows/Linux style: right side */}
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TitleBar;
