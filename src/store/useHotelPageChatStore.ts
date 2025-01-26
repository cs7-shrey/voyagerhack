import { create } from "zustand";

interface Message {
    sender: "user" | "bot";
    text: string;
    mode: "text" | "voice"
}
interface HotelPageChatStore {
    messages: Message[];
    setMessages: (messages: Message[]) => void;
}

export const useHotelPageChatStore = create<HotelPageChatStore>((set) => ({
    messages: [],
    setMessages: (messages) => set({ messages }),
}));