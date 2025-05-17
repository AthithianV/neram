// App.tsx
import { Route, Routes } from "react-router-dom";
import Analytics from "./pages/Analytics.tsx";
import { AppLayout } from "./components/layouts/AppLayout";
import Dashboard from "./pages/Dashboard.tsx";
import "./styles/global.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
}
