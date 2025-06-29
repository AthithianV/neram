import {
    Settings,
    Tag,
    RotateCcw,
    BarChart,
    LayoutDashboard,
    Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SIDEBAR_BODY_LINKS = [
    <Link to="/dashboard" key="dashboard" className="flex items-center gap-2">
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
    </Link>,
    <Link to="/session" key="session" className="flex items-center gap-2">
        <Calendar size={18} />
        <span>Session</span>
    </Link>,
    <Link to="/project" key="project" className="flex items-center gap-2">
        <Tag size={18} />
        <span>Project</span>
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
