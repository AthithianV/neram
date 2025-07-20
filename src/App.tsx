import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// Styles
import './styles/animate.css';
import './styles/global.css';

// Layout
import { AppLayout } from './components/layouts/AppLayout';

// Lazy-loaded pages
const Analytics = lazy(() => import('./pages/Analytics'));
const Pomodoro = lazy(() => import('./pages/Pomodaro'));
const CloudSync = lazy(() => import('./pages/CloudSync'));
const Settings = lazy(() => import('./pages/Settings'));
const Session = lazy(() => import('./pages/Session'));
const Project = lazy(() => import('./pages/Project'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Lazy-loaded nested components
const Kanban = lazy(() => import('./components/project/Kanban'));

export default function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="session" element={<Session />}></Route>
                    <Route path="project" element={<Project />}>
                        <Route path=":projectId" element={<Kanban />} />
                    </Route>
                    <Route path="pomodoro" element={<Pomodoro />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="cloud-sync" element={<CloudSync />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </Suspense>
    );
}
