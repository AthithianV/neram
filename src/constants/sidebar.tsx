import {
  Timer,
  Settings,
  Tag,
  NotebookPen,
  RotateCcw,
  BarChart,
} from "lucide-react";

export const SIDEBAR_BODY_LINKS = [
  {
    key: "dashboard",
    title: "Dashboard",
    icon: <Timer />,
    href: "/dashboard",
  },
  {
    key: "task-tag",
    title: "Task/Tag",
    icon: <Tag />,
    href: "/task-tag",
  },
  {
    key: "todos",
    title: "Todos",
    icon: <NotebookPen />,
    href: "/todos",
  },
  {
    key: "analytics",
    title: "Analytics",
    icon: <BarChart />,
    href: "/analytics",
  },
  {
    key: "pomodoro",
    title: "Pomodoro",
    icon: <RotateCcw />,
    href: "/pomodoro",
  },
];

export const SIDEBAR_FOOTER_LINKS = [
  {
    key: "settings",
    title: "Settings",
    icon: <Settings />,
    href: "/settings",
  },
];
