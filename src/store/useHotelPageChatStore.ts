import { create } from "zustand";
import { getHotelInfoFormatted } from "@/lib/utils";
import { useHotelDescStore } from "./useHotelDescStore";
export interface Message {
    sender: "user" | "bot";
    text: string;
    mode: "text" | "voice"
}
interface HotelPageChatStore {
    messages: Message[];
    textSocket: WebSocket | null;
    audioSocket: WebSocket | null;
    canSpeak: boolean;
    waitingForMessage: boolean;
    setMessages: (messages: Message[]) => void;
    setTextSocket: (socket: WebSocket | null) => void;
    setAudioSocket: (socket: WebSocket) => void;
    setCanSpeak: (canSpeak: boolean) => void;
    setWaitingForMessage: (waitingForMessage: boolean) => void;
    connectTextSocket: (id: bigint) => Promise<WebSocket | void>;
    connectAudioSocket: (lang: 'en' | 'hi') => Promise<WebSocket | void>;
    disconnectTextSocket: () => void;
    disconnectAudioSocket: () => void;
}
const BASE_URL = import.meta.env.VITE_SOCKET_BASE_URL
export const useHotelPageChatStore = create<HotelPageChatStore>((set, get) => ({
    messages: [],
    textSocket: null,
    audioSocket: null,
    canSpeak: false,
    waitingForMessage: false,
    setMessages: (messages) => set({ messages }),
    setTextSocket: ( socket ) => set({textSocket: socket}),
    setAudioSocket: ( socket ) => set({ audioSocket: socket}),
    setCanSpeak: (canSpeak: boolean) => set({ canSpeak }),
    setWaitingForMessage: (waitingForMessage) => set({ waitingForMessage }),
    connectTextSocket: async (id) => {
        // check if the socket already open : TODO
        if (get().textSocket?.readyState === WebSocket.OPEN) {
            get().textSocket?.close()
        }
        const { hotelData }  = useHotelDescStore.getState()
        const name = hotelData?.name
        const location = hotelData?.location
        const ws = new WebSocket(`${BASE_URL}/hotel/exp/${id}/ws/chat?hotel_name=${name}&hotel_location=${location}`);
        const res = await new Promise((resolve, reject) => {
            ws.onopen = () => {
                const info = getHotelInfoFormatted();
                console.log("chat text ws connected");
                ws.send(JSON.stringify({'hotel_info': info}));
                resolve(true);
            }
            ws.onerror = () => {
                console.log("an error with the text chat web socket");
                reject(false);
            }
        })
        if (!res) {
            console.log('could not connect')
            ws.close();
            set({ textSocket: null});
            return
        }
        set({ textSocket: ws})
        return ws
    },
    connectAudioSocket: async (lang) => {
        //
        if (get().audioSocket?.readyState === WebSocket.OPEN) {
            get().audioSocket?.close()
        }
        if (get().textSocket?.readyState !== WebSocket.OPEN) {
            return
        }
        const audioSocket = new WebSocket(`ws://${BASE_URL}/ws/audio/${lang}?service=chat`);
        const res = await new Promise((resolve, reject) => {
            audioSocket.onopen = () => {
                console.log("Audio WebSocket connected!");
                resolve(true)
            }
            // here, an error would mean a connection error
            audioSocket.onerror = () => {
                reject(false)
            }
        })
        if (!res ) {
            if (audioSocket.readyState === WebSocket.OPEN) audioSocket.close();
            set({ audioSocket: null })
            set({ canSpeak: false})
            return
        }
        set({ audioSocket })
        set({ canSpeak: true})
        return audioSocket
    },
    disconnectTextSocket: () => {
        if(!get().textSocket || get().textSocket?.readyState == WebSocket.CLOSED || get().textSocket?.readyState == WebSocket.CLOSING) return
        get().textSocket?.close()
    },
    disconnectAudioSocket: () => {
        set({ canSpeak: false})
        if (!get().audioSocket || get().audioSocket?.readyState == WebSocket.CLOSED || get().audioSocket?.readyState == WebSocket.CLOSING) return
        get().audioSocket?.close()
    }
}));