import { requireRole } from '@/lib/session';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserRole = 'USER' | 'DRIVER' | 'ADMIN';

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string | null;
  role: UserRole;
}

interface UserState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isUser: boolean;
  isDriver: boolean;
  isAdmin: boolean;
  setUser: (user: UserInfo) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isUser: false,
      isDriver: false,
      isAdmin: false,
      setUser: (user) => set({ 
        user, 
        isAuthenticated: true,
        isUser: user.role === 'USER',
        isDriver: user.role === 'DRIVER',
        isAdmin: user.role === 'ADMIN'
      }),
      clearUser: () => set({ 
        user: null, 
        isAuthenticated: false,
        isUser: false,
        isDriver: false,
        isAdmin: false
      }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => 
        typeof window !== 'undefined' ? window.localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        } as any
      ),
    }
  )
);
