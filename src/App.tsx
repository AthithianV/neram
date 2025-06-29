import { Navigate, Route, Routes } from 'react-router-dom';

// Styles
import './styles/global.css';
import './styles/animate.css';

// Components
import { AppLayout } from './components/layouts/AppLayout';

// Components
import Analytics from './pages/Analytics.tsx';
import Pomodoro from './pages/Pomodaro.tsx';
import CloudSync from './pages/CloudSync.tsx';
import Settings from './pages/Settings.tsx';
import Session from './pages/Session.tsx';
import Project from './pages/Project.tsx';
import Dashboard from './pages/Dashboard.tsx';
import { SessionForm } from './components/Session/SessionForm.tsx';
import Kanban from './components/Project/Kanban.tsx';

export default function App() {
    return (
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
                    {/* <Route path="add-project" element={<ProjectForm />} /> */}
                </Route>
                <Route path="pomodoro" element={<Pomodoro />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="cloud-sync" element={<CloudSync />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}
