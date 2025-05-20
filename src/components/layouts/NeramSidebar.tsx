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

import { SIDEBAR_BODY_LINKS, SIDEBAR_FOOTER_LINKS } from "@/constants/sidebar";
import Brand from "../Brand";
import { Separator } from "../ui/separator";

const NeramSidebar = () => {
  return (
    <SidebarProvider>
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
                    <SidebarMenuButton asChild>
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
                <SidebarMenuButton asChild>
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
          <Brand collapse={open} />
          <SidebarTrigger />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};

export default NeramSidebar;
