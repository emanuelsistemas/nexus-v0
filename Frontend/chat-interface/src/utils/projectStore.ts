import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  chatId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectStore {
  projects: Project[];
  activeProject: Project | null;
  addProject: (project: Omit<Project, "chatId" | "createdAt" | "updatedAt">) => Project;
  setActiveProject: (projectId: string) => void;
  getProjectByChatId: (chatId: string) => Project | null;
  getChatIdByProject: (projectId: string) => string | null;
}

export const useProjectStore = create<ProjectStore>(
  persist(
    (set, get) => ({
      projects: [],
      activeProject: null,

      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          chatId: `chat_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          projects: [...state.projects, newProject],
        }));

        return newProject;
      },

      setActiveProject: (projectId) => {
        const project = get().projects.find((p) => p.id === projectId) || null;
        set({ activeProject: project });
      },

      getProjectByChatId: (chatId) => {
        return get().projects.find((p) => p.chatId === chatId) || null;
      },

      getChatIdByProject: (projectId) => {
        const project = get().projects.find((p) => p.id === projectId);
        return project ? project.chatId : null;
      },
    }),
    {
      name: "project-storage",
    }
  )
);
