import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (username: string, password: string) => {
        // Por enquanto, vamos apenas simular um login bem-sucedido
        // Aqui você pode adicionar a lógica real de autenticação depois
        const mockUser = {
          id: "user_" + Date.now(),
          username,
        };

        set({
          user: mockUser,
          isAuthenticated: true,
        });

        return true;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
