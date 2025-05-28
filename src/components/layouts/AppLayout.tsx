import { Outlet } from "react-router-dom";
import Sidebar from "./NeramSidebar";
import { Toaster } from "../ui/sonner";

export function AppLayout() {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <Toaster />
      <main className="flex-1 bg-background text-foreground p-4 overflow-y-auto h-full">
        <Outlet />
      </main>
    </div>
  );
}
