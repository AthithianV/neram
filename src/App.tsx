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
import Todo from './pages/Todo.tsx';
import Dashboard from './pages/Dashboard.tsx';
import TaskTag from './pages/TaskTag.tsx';
import { SessionForm } from './components/session/SessionForm.tsx';

export default function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="dashboard" element={<Dashboard />}>
                    <Route path="add-session" element={<SessionForm />} />
                    <Route
                        path="update-session/:sessionId"
                        element={<SessionForm />}
                    />
                </Route>
                <Route path="task-tag" element={<TaskTag />} />
                <Route path="pomodoro" element={<Pomodoro />} />
                <Route path="todos" element={<Todo />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="cloud-sync" element={<CloudSync />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}
