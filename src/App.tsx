import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import LoadingPage from './components/layouts/LoadingPage';

// // Styles
import './styles/global.css';

// Layout
import { AppLayout } from './components/layouts/AppLayout';

// Constant
import { SETTINGS_TAB } from './constants/settings';

// Lazy-loaded pages
const Statistics = lazy(() => import('./pages/Statistics'));
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
        <Suspense fallback={<LoadingPage />}>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="session" element={<Session />}></Route>
                    <Route path="project" element={<Project />}>
                        <Route path=":projectId" element={<Kanban />} />
                    </Route>
                    <Route path="pomodoro" element={<Pomodoro />} />
                    <Route path="statistic" element={<Statistics />} />
                    <Route path="cloud-sync" element={<CloudSync />} />
                    <Route path="settings" element={<Settings />}>
                        {SETTINGS_TAB.map((tab) => (
                            <Route
                                path={tab.path}
                                element={<tab.element />}
                                key={tab.title}
                            />
                        ))}
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    );
}
