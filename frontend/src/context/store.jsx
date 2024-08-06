import { create } from 'zustand';


export const useStore = create((set) => ({
    messages: [],
    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),
}));
