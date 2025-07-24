import NeramLogo from '@/assets/logo.png';
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
    SidebarTrigger,
    useSidebar,
} from '@/components/ui/sidebar';
import { SIDEBAR_BODY_LINKS, SIDEBAR_FOOTER_LINKS } from '@/constants/sidebar';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import Brand from './Brand';

const NeramSidebar = () => {
    const { pathname } = useLocation();

    return (
        <SidebarProvider className="h-full w-fit">
            <Sidebar collapsible="icon" className="h-full">
                <Header />
                {/* Body */}
                <SidebarContent className="h-full">
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {SIDEBAR_BODY_LINKS.map((link, index) => (
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
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </SidebarProvider>
    );
};

const Header = () => {
    const { open } = useSidebar();

    return (
        <SidebarHeader
            className={cn(
                'title-bar-height bg-white',
                open ? 'border-b-2 border-gray-100' : '',
            )}
        >
            <SidebarMenu>
                <SidebarMenuItem
                    className={`${
                        open ? 'flex-row' : 'flex-col'
                    } flex gap-2 px-2 justify-between items-center`}
                >
                    {open ? (
                        <Brand />
                    ) : (
                        <img
                            src={NeramLogo}
                            alt="Neram Logo"
                            className="h-4 w-4 rounded-md"
                        />
                    )}
                    <SidebarTrigger />
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
    );
};

export default NeramSidebar;
