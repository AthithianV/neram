import { ListTodo, Timer, Database, Settings } from "lucide-react";

export const SIDEBAR_BODY_LINKS = [
  {
    key: "dashboard",
    title: "Dashboard",
    icon: <Timer size={5} />,
    href: "/dashboard",
  },
  {
    key: "todos",
    title: "Todos",
    icon: <ListTodo size={5} />,
    href: "/todos",
  },
  {
    key: "data",
    title: "Data",
    icon: <Database size={5} />,
    href: "/data",
  },
];

export const SIDEBAR_FOOTER_LINKS = [
  {
    key: "settings",
    title: "Settings",
    icon: <Settings size={5} />,
    href: "/settings",
  },
];
