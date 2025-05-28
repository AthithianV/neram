import { Outlet } from "react-router-dom";
import Sidebar from "./NeramSidebar";
import { Toaster } from "../ui/sonner";

export function AppLayout() {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <Toaster />
      <main className="flex-1 text-foreground p-4 overflow-y-auto h-full bg-main">
        <Outlet />
      </main>
    </div>
  );
}
