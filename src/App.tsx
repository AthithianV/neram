import { Navigate, Route, Routes } from "react-router-dom";

// Styles
import "./styles/global.css";

// Components
import { AppLayout } from "./components/layouts/AppLayout";

// Components
import Analytics from "./pages/Analytics.tsx";
import Focus from "./pages/Focus.tsx";
import CloudSync from "./pages/CloudSync.tsx";
import Settings from "./pages/Settings.tsx";
import Todo from "./pages/Todo.tsx";
import TimeTracking from "./pages/TimeTracking.tsx";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/time-tracking" />} />
        <Route path="time-tracking" element={<TimeTracking />} />
        <Route path="focus" element={<Focus />} />
        <Route path="todos" element={<Todo />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="cloud-sync" element={<CloudSync />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
