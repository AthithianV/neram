import { Route, Routes } from "react-router-dom";

// Styles
import "./styles/global.css";

// Components
import { AppLayout } from "./components/layouts/AppLayout";

// Components
import Analytics from "./pages/Analytics.tsx";
import Focus from "./pages/Focus.tsx";
import CloudSync from "./pages/CloudSync.tsx";
import Settings from "./pages/Settings.tsx";
import TasksTags from "./pages/TasksTags.tsx";
import TimeTracking from "./pages/TimeTracking.tsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="time-tracking" element={<TimeTracking />} />
        <Route path="focus" element={<Focus />} />
        <Route path="tasks-tags" element={<TasksTags />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="cloud-sync" element={<CloudSync />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
