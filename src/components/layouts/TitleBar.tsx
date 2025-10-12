import { platform } from '@tauri-apps/plugin-os';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { useStopTimer } from '@/hooks/useTimer';
import Close from '../icons/Close';
import Minimize from '../icons/Minimize';
import RestoreDown from '../icons/RestoreDown';
import RestoreUp from '../icons/RestoreUp';
import Brand from './Brand';

const TitleBar = () => {
    const [isMaximized, setIsMaximized] = useState(false);
    const [os, setOs] = useState<string | null>(null);
    const { mutateAsync: stopTimer } = useStopTimer();

    useEffect(() => {
        const init = async () => {
            const appWindow = getCurrentWindow();
            const currentOs = await platform();
            setOs(currentOs);

            const maximized = await appWindow.isMaximized();
            setIsMaximized(maximized);

            const unlisten = await appWindow.onResized(() => {
                appWindow.isMaximized().then(setIsMaximized);
            });

            return () => unlisten();
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

    const isMac = os === 'darwin' || os === 'macos';

    return (
        <div className="w-full h-8 flex items-center bg-sidebar select-none">
            <div
                onMouseDown={handleStartDragging}
                className={`w-full flex items-center justify-between px-3`}
            >
                {isMac && <Brand />}

                {/* Center section (for app title, if you want later) */}
                <div className="flex-1 text-center text-sm font-medium text-muted-foreground"></div>

                {/* Windows/Linux controls on right */}
                {!isMac && (
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
                )}
            </div>
        </div>
    );
};

export default TitleBar;
