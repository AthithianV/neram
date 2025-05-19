import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  BarChart2,
  Timer,
  Settings,
  FolderGit2,
  Cloud,
} from "lucide-react";

import NeramLogo from "@/assets/logo.svg";

const links = [
  { to: "/", icon: Home, label: "Dashboard" },
  { to: "/focus", icon: Timer, label: "Focus Mode" },
  { to: "/tasks-tags", icon: FolderGit2, label: "Tasks/Tags" },
  { to: "/analytics", icon: BarChart2, label: "Analytics" },
  { to: "/cloud-sync", icon: Cloud, label: "Cloud Sync" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="h-screen w-60 shrink-0 border-r bg-background p-4">
      <div className="text-lg font-semibold flex gap-2 items-center justify-center border-b-2 border-gray-100 pb-2 mb-2">
        <img src={NeramLogo} alt="Neram Logo" className="h-8 w-8 rounded-md" />
        <h1>Neram</h1>
      </div>
      <NavigationMenu
        orientation="vertical"
        className="flex-1 max-w-full w-full items-start [&>div]:w-full"
      >
        <NavigationMenuList className="flex flex-col gap-1 w-full">
          {links.map(({ to, icon: Icon, label }) => (
            <NavigationMenuItem key={to} className="w-full">
              <NavLink to={to}>
                {({ isActive }) => (
                  <NavigationMenuLink
                    className={cn(
                      "flex flex-row max-w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="size-5" />
                    {label}
                  </NavigationMenuLink>
                )}
              </NavLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </aside>
  );
}
