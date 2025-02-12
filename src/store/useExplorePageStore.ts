import { create } from 'zustand';
import { Sender } from '@/lib/exploreChat';

export interface Place {
    name: string;
    address: string;
    imageURL: string;
    googleMapsLink: string;
}

export interface Event {
    name: string;
    description: string;
    infoURL: string;    
    imageURL: string;
}

interface ChatMessage {
    sender: Sender;
    message: string;
    isThinking?: boolean
}
interface ExplorePageStore {
    places: Place[];
    events: Event[];
    chatMessages: ChatMessage[]; 
    setPlaces: (places: Place[]) => void;
    addPlace: (place: Place) => void;
    setEvents: (events: Event[]) => void;
    addEvent: (event: Event) => void;
    setChatMessages: (messages: ChatMessage[]) => void;
    addChatMessage: (message: ChatMessage) => void;
}

export const useExplorePageStore = create<ExplorePageStore>((set) => ({
    places: [],
    events: [],
    chatMessages: [],
    setPlaces: (places) => set({ places }),
    addPlace: (place) => set((state) => ({ places: [place, ...state.places] })),
    setEvents: (events) => set({ events }),
    addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),
    setChatMessages: (messages) => set({ chatMessages: messages }),
    addChatMessage: (message) => set((state) => ({ chatMessages: [...state.chatMessages, message] }))
}));