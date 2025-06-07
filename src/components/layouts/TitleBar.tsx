import { Window } from '@tauri-apps/api/window';
import { Button } from '../ui/button';
import { Maximize, Minus, X } from 'lucide-react';
import { SidebarMenu, useSidebar, SidebarHeader } from '../ui/sidebar';
import { SidebarTrigger } from '../ui/sidebar';
import Brand from '../Brand';
import NeramLogo from '@/assets/logo.png';
import { SidebarMenuItem } from '../ui/sidebar';

const TitleBar = () => {
    const window = Window.getCurrent();

    return (
        <div
            onMouseDown={() => window.startDragging()}
            className="w-full flex justify-between border-b-2 border-gray-100"
        >
            <div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.minimize()}
                >
                    <Minus />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.maximize()}
                >
                    <Maximize />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.close()}
                >
                    <X />
                </Button>
            </div>
        </div>
    );
};



export default TitleBar;
