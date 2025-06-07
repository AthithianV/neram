import {
    Settings,
    Tag,
    NotebookPen,
    RotateCcw,
    BarChart,
    LayoutDashboard,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SIDEBAR_BODY_LINKS = [
    <Link to="/dashboard" key="dashboard" className="flex items-center gap-2">
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
    </Link>,
    <Link to="/task-tag" key="task-tag" className="flex items-center gap-2">
        <Tag size={18} />
        <span>Task/Tag</span>
    </Link>,
    <Link to="/todos" key="todos" className="flex items-center gap-2">
        <NotebookPen size={18} />
        <span>Todos</span>
    </Link>,
    <Link to="/analytics" key="analytics" className="flex items-center gap-2">
        <BarChart size={18} />
        <span>Analytics</span>
    </Link>,
    <Link to="/pomodoro" key="pomodoro" className="flex items-center gap-2">
        <RotateCcw size={18} />
        <span>Pomodoro</span>
    </Link>,
];

export const SIDEBAR_FOOTER_LINKS = [
    <Link to="/settings" key="settings" className="flex items-center gap-2">
        <Settings size={18} />
        <span>Settings</span>
    </Link>,
];
