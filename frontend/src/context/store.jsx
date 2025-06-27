import { create } from 'zustand';

export const useStore = create((set, get) => ({
    messages: [],
    isStreaming: false,
    currentStreamingMessage: null,
    
    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),
    
    startStreaming: (message) => set((state) => ({
        isStreaming: true,
        currentStreamingMessage: {
            message: message,
            response: "",
            isStreaming: true
        },
        messages: [...state.messages, {
            message: message,
            response: "",
            isStreaming: true
        }]
    })),
    
    updateStreamingResponse: (content) => set((state) => {
        const updatedMessages = [...state.messages];
        const lastMessage = updatedMessages[updatedMessages.length - 1];
        
        if (lastMessage && lastMessage.isStreaming) {
            lastMessage.response += content;
        }
        
        return {
            messages: updatedMessages,
            currentStreamingMessage: lastMessage
        };
    }),
    
    finishStreaming: () => set((state) => {
        const updatedMessages = [...state.messages];
        const lastMessage = updatedMessages[updatedMessages.length - 1];
        
        if (lastMessage && lastMessage.isStreaming) {
            lastMessage.isStreaming = false;
        }
        
        return {
            isStreaming: false,
            currentStreamingMessage: null,
            messages: updatedMessages
        };
    }),
    
    clearMessages: () => set({
        messages: [],
        isStreaming: false,
        currentStreamingMessage: null
    })
}));
