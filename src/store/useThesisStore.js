import { create } from 'zustand';

export const useThesisStore = create((set) => ({
    isOpen: false,
    openThesis: () => set({ isOpen: true }),
    closeThesis: () => set({ isOpen: false }),
}));
