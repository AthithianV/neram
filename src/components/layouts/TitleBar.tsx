import { Window } from '@tauri-apps/api/window';
import { Button } from '../ui/button';
import { Maximize, Minus, Square, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const TitleBar = () => {
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        window.isMaximized().then((isMaximized) => {
            setIsMaximized(isMaximized);
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
                    <Minus />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="px-6 h-full rounded-none"
                    onClick={() => window.maximize()}
                >
                    {isMaximized ? (
                        <Square size={10} />
                    ) : (
                        <Maximize size={10} />
                    )}
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="px-6 h-full rounded-none hover:bg-red-500"
                    onClick={() => window.close()}
                >
                    <X size={12} />
                </Button>
            </div>
        </div>
    );
};

export default TitleBar;
