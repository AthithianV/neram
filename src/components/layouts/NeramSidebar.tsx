import { platform } from '@tauri-apps/plugin-os';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    useSidebar,
} from '@/components/ui/sidebar';
import { SIDEBAR_BODY_LINKS, SIDEBAR_FOOTER_LINKS } from '@/constants/sidebar';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import Brand from './Brand';
import { AboutModal } from '../about/AboutModal';
import { useEffect, useState } from 'react';

const NeramSidebar = () => {
    const { pathname } = useLocation();

    return (
        <SidebarProvider className="h-full w-fit">
            <Sidebar collapsible="icon" className="h-full border-none">
                <Header />
                <SidebarContent className="h-full">
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {SIDEBAR_BODY_LINKS.map((link, index) => (
                                    <SidebarMenuItem key={index}>
                                        <SidebarMenuButton
                                            asChild
                                            className={cn(
                                                pathname.startsWith(
                                                    link.props.to,
                                                ) &&
                                                    'bg-sidebar-accent font-semibold text-theme hover:text-theme',
                                                'px-4 !h-auto text-[0.9rem] rounded-[5px] active:text-none',
                                            )}
                                        >
                                            {link}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                {/*Footer*/}
                <SidebarFooter>
                    <SidebarMenu>
                        {SIDEBAR_FOOTER_LINKS.map((link, index) => (
                            <SidebarMenuItem key={index}>
                                <SidebarMenuButton
                                    asChild
                                    className={cn(
                                        pathname.startsWith(link.props.to) &&
                                            'bg-sidebar-accent font-semibold text-theme hover:text-theme',
                                        'px-4 !h-auto text-[0.9rem] rounded-md',
                                    )}
                                >
                                    {link}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <AboutModal />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </SidebarProvider>
    );
};

const Header = () => {
    const [os, setOs] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            const currentOs = await platform();
            setOs(currentOs);
        };

        init();
    }, []);
    const { open } = useSidebar();

    const isMac = os === 'darwin' || os === 'macos';

    return (
        !isMac && (
            <SidebarHeader className={cn('title-bar-height')}>
                <SidebarMenu>
                    <SidebarMenuItem
                        className={`${
                            open ? 'flex-row' : 'flex-col'
                        } flex gap-2 px-4 items-center`}
                    >
                        <Brand />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
        )
    );
};

export default NeramSidebar;
