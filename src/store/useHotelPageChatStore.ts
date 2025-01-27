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
    textSocket: WebSocket | null
    setMessages: (messages: Message[]) => void;
    setTextSocket: (socket: WebSocket) => void
    connectTextSocket: (id: bigint) => Promise<WebSocket | void>
    disconnectTextSocket: () => void
}
const BASE_URL = import.meta.env.VITE_BASE_URL
export const useHotelPageChatStore = create<HotelPageChatStore>((set, get) => ({
    messages: [],
    setMessages: (messages) => set({ messages }),
    textSocket: null,
    setTextSocket: ( socket ) => set({textSocket: socket}),
    connectTextSocket: async (id) => {
        // check if the socket already open : TODO
        if (get().textSocket?.OPEN) {
            get().textSocket?.close()
        }
        const { hotelData }  = useHotelDescStore.getState()
        const name = hotelData?.name
        const location = hotelData?.location
        const ws = new WebSocket(`ws://${BASE_URL}/hotel/${id}/ws/chat?mode=text&hotel_name=${name}&hotel_location=${location}`);
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
            ws.close();
            set({ textSocket: null});
            return
        }
        set({ textSocket: ws})
        return ws
    },
    disconnectTextSocket: () => {},
}));