import {
    BarChart,
    Calendar,
    Folder,
    LayoutDashboard,
    Settings,
    Timer,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SIDEBAR_BODY_LINKS = [
    <Link to="/dashboard" key="Dashboard" className="flex items-center gap-2">
        <LayoutDashboard size={16} />
        <span>Dashboard</span>
    </Link>,
    <Link to="/session" key="Session" className="flex items-center gap-2">
        <Calendar size={16} />
        <span>Session</span>
    </Link>,
    <Link to="/project" key="Project" className="flex items-center gap-2">
        <Folder size={16} />
        <span>Project</span>
    </Link>,
    <Link to="/analytics" key="Analytics" className="flex items-center gap-2">
        <BarChart size={16} />
        <span>Analytics</span>
    </Link>,
    <Link to="/pomodoro" key="Pomodoro" className="flex items-center gap-2">
        <Timer size={16} />
        <span>Pomodoro</span>
    </Link>,
];

export const SIDEBAR_FOOTER_LINKS = [
    <Link to="/settings" key="Settings" className="flex items-center gap-2">
        <Settings size={18} />
        <span>Settings</span>
    </Link>,
];
