import { create } from 'zustand';

type ViewState = {
    isSidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
};

export const useViewStore = create<ViewState>((set) => ({
    isSidebarOpen: true,
    setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),
}));
