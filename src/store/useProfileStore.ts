import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
  name: string;
  avatar: string | null;
  savedPlaces: { id: string; label: string; address: string }[];
  
  updateName: (name: string) => void;
  updateAvatar: (url: string) => void;
  addSavedPlace: (place: { label: string; address: string }) => void;
  removeSavedPlace: (id: string) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: '',
      avatar: null,
      savedPlaces: [],

      updateName: (name) => set({ name }),
      updateAvatar: (avatar) => set({ avatar }),
      addSavedPlace: (place) => set((state) => ({
        savedPlaces: [...state.savedPlaces, { ...place, id: Math.random().toString(36).substr(2, 9) }]
      })),
      removeSavedPlace: (id) => set((state) => ({
        savedPlaces: state.savedPlaces.filter(p => p.id !== id)
      })),
    }),
    {
      name: 'transport-hub-profile',
    }
  )
);
