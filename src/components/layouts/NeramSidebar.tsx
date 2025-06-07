import {
    Sidebar,
    SidebarContent,
    SidebarGroupContent,
    SidebarFooter,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { useLocation } from 'react-router-dom';
import { SIDEBAR_BODY_LINKS, SIDEBAR_FOOTER_LINKS } from '@/constants/sidebar';
import { useSidebar } from '@/components/ui/sidebar';
import NeramLogo from '@/assets/logo.png';
import Brand from '../Brand';

const NeramSidebar = () => {
    const { pathname } = useLocation();

    return (
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
                                        className={`${
                                            link.props.to ===
                                                pathname.split('/')[1] &&
                                            'bg-sidebar-accent font-semibold text-theme hover:text-theme'
                                        }`}
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
                                className={`${
                                    link.props.to === pathname.split('/')[1] &&
                                    'bg-sidebar-accent font-semibold text-theme hover:text-theme'
                                }`}
                            >
                                {link}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};

const Header = () => {
    const { open } = useSidebar();

    return (
        <SidebarHeader className="my-2">
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
