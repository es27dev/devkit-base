// 6. Global State (Zustand)
// Use: App-wide state (Auth, Theme, UI preferences)
// Install: npm install zustand

import { create } from "zustand";

interface AuthStore {
  user: { id: string; name: string } | null;
  setUser: (user: { id: string; name: string } | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// Usage in component:
// const { user, setUser } = useAuthStore();
