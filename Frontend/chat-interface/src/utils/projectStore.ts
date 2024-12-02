import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ProjectStatus = "active" | "archived" | "completed";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

interface ProjectStore {
  projects: Project[];
  activeProject: Project | null;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (project: Project) => void;
  clearActiveProject: () => void;
}

export const useProjectStore = create<ProjectStore>(
  persist(
    (set) => ({
      projects: [],
      activeProject: null,
      setProjects: (projects) => set({ projects }),
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),
      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? {
                  ...project,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : project
          ),
          // Atualiza também o projeto ativo se for o mesmo
          activeProject:
            state.activeProject?.id === id
              ? {
                  ...state.activeProject,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : state.activeProject,
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          // Limpa o projeto ativo se for o mesmo que está sendo excluído
          activeProject: state.activeProject?.id === id ? null : state.activeProject,
        })),
      setActiveProject: (project) => set({ activeProject: project }),
      clearActiveProject: () => set({ activeProject: null }),
    }),
    {
      name: "project-storage",
      partialize: (state) => ({
        projects: state.projects,
        // Não persiste o projeto ativo
      }),
    }
  )
);
