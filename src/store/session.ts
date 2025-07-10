import { MinimalProject } from '@/hooks/useProject';
import { MiniTask } from '@/hooks/useTask';
import { create } from 'zustand';

export interface SessionState {
    selectedProject: MinimalProject | null;
    setSelectedProject: (project: MinimalProject | null) => void;
    selectedTask: MiniTask | null;
    setSelectedTask: (task: MiniTask | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    selectedProject: null,
    setSelectedProject: (project) => set({ selectedProject: project }),
    selectedTask: null,
    setSelectedTask: (task) => set({ selectedTask: task }),
}));
