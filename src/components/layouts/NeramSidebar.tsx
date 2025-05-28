import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import { SIDEBAR_BODY_LINKS, SIDEBAR_FOOTER_LINKS } from "@/constants/sidebar";
import Brand from "../Brand";
import NeramLogo from "@/assets/logo.png";
import { Separator } from "../ui/separator";

const NeramSidebar = () => {
  const { pathname } = useLocation();

  return (
    <SidebarProvider className="w-fit">
      <Sidebar collapsible="icon">
        {/* Header */}
        <NeramSidebarHeader />

        <Separator />

        {/* Body */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {SIDEBAR_BODY_LINKS.map((link) => (
                  <SidebarMenuItem key={link.title}>
                    <SidebarMenuButton
                      asChild
                      className={`${
                        link.key === pathname.split("/")[1] &&
                        "bg-sidebar-accent font-semibold text-theme hover:text-theme"
                      }`}
                    >
                      <a href={link.href}>
                        {link.icon}
                        <span>{link.title}</span>
                      </a>
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
            {SIDEBAR_FOOTER_LINKS.map((link) => (
              <SidebarMenuItem key={link.title}>
                <SidebarMenuButton
                  asChild
                  className={`${
                    link.key === pathname.split("/")[1] &&
                    "bg-sidebar-accent font-semibold text-theme hover:text-theme"
                  }`}
                >
                  <a href={link.href}>
                    {link.icon}
                    <span>{link.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
};

const NeramSidebarHeader = () => {
  const { open } = useSidebar();

  return (
    <SidebarHeader className="my-2">
      <SidebarMenu>
        <SidebarMenuItem
          className={`${
            open ? "flex-row" : "flex-col"
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
