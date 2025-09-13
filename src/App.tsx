import { Suspense, lazy, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Navigate, Route, Routes } from 'react-router-dom';

import LoadingPage from './components/layouts/LoadingPage';

// // Styles
import './styles/global.css';

// Layout
import { AppLayout } from './components/layouts/AppLayout';

// Constant
import ErrorFallback from './components/error/MainErrorFallBack';
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
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        window.addEventListener('contextmenu', handleContextMenu);
        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    useEffect(() => {
        const blockDevTools = (e: KeyboardEvent) => {
            if (
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                // (e.ctrlKey && e.shiftKey && e.key === 'J') ||
                (e.ctrlKey && e.key === 'U') ||
                e.key === 'F12'
            ) {
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', blockDevTools);
        return () => {
            window.removeEventListener('keydown', blockDevTools);
        };
    }, []);

    return (
        <Suspense fallback={<LoadingPage />}>
            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onError={(error, info) => {
                    // Log to Tauri backend or Sentry
                    console.error('Boundary caught:', error, info);
                }}
            >
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
                            {SETTINGS_TAB.map((tab) =>
                                tab.index ? (
                                    <Route
                                        index
                                        element={
                                            <Suspense fallback={<div>Loading...</div>}>
                                                <tab.element />
                                            </Suspense>
                                        }
                                        key={tab.title}
                                    />
                                ) : (
                                    <Route
                                        path={tab.path}
                                        element={
                                            <Suspense fallback={<div>Loading...</div>}>
                                                <tab.element />
                                            </Suspense>
                                        }
                                        key={tab.title}
                                    />
                                ),
                            )}
                        </Route>
                    </Route>
                </Routes>
            </ErrorBoundary>
        </Suspense>
    );
}
