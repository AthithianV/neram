import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Styles
import './styles/global.css';
import './styles/animate.css';

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
const SessionForm = lazy(() => import('./components/session/SessionForm'));
const Kanban = lazy(() => import('./components/project/Kanban'));

export default function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="session" element={<Session />}>
                        <Route path="add-session" element={<SessionForm />} />
                        <Route
                            path="update-session/:sessionId"
                            element={<SessionForm />}
                        />
                    </Route>
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
