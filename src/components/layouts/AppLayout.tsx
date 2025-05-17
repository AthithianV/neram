import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex-1 bg-background text-foreground p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
