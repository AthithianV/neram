import { Window } from '@tauri-apps/api/window';
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

const TitleBar = () => {
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        window.onResized((event) => {
            console.log(event);
            window.isMaximized().then((isMaximized) => {
                setIsMaximized(isMaximized);
            });
        });
    }, []);

    const window = Window.getCurrent();

    return (
        <div
            onMouseDown={() => window.startDragging()}
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
                    onClick={() => window.minimize()}
                >
                    <Minimize />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="px-6 h-full rounded-none"
                    onClick={() => window.maximize()}
                >
                    {isMaximized ? <RestoreDown /> : <Square />}
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="px-6 h-full rounded-none hover:bg-red-500"
                    onClick={() => window.close()}
                >
                    <Close />
                </Button>
            </div>
        </div>
    );
};

export default TitleBar;
