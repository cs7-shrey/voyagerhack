import { create } from 'zustand'
import { Language } from '@/lib/language';
interface SocketState {
    audioSocket: WebSocket | null;
    llmSocket: WebSocket | null;
    canSpeak: boolean;
    lang: Language;
    waitingForMessage: boolean;
    setAudioSocket: (socket: WebSocket) => void;
    setLlmSocket: (socket: WebSocket) => void;
    setCanSpeak: (canSpeak: boolean) => void;
    setLang: (lang: Language) => void;
    setWaitingForMessage: (wfm: boolean) => void
    connectAudioSocket: () => Promise<WebSocket | void>;
    connectLlmSocket: () => Promise<WebSocket | void>;
    disconnectAudioSocket: () => void;
    disconnectLlmSocket: () => void;
}
const BASE_SOCKET_URL = import.meta.env.VITE_SOCKET_BASE_URL;
export const useSocketStore = create<SocketState>()((set, get) => ({
    audioSocket: null,
    llmSocket: null,
    canSpeak: false,
    lang: Language.English,
    waitingForMessage: false,
    setAudioSocket: (socket: WebSocket) => set({ audioSocket: socket }),
    setLlmSocket: (socket: WebSocket) => set({ llmSocket: socket }),
    setCanSpeak: (canSpeak: boolean) => set({ canSpeak }),  
    setLang: (lang) => set({lang}),
    setWaitingForMessage: ( waitingForMessage ) => set({waitingForMessage}),    
    connectAudioSocket: async () => {
        if (get().audioSocket?.readyState === WebSocket.OPEN) {
            get().disconnectAudioSocket();
        }
        if (get().llmSocket?.readyState !== WebSocket.OPEN) {
            return                      // wouldn't happen in a ideal case
        }
        // the llm web socket is open
        const audioSocket = new WebSocket(`${BASE_SOCKET_URL}/ws/audio/${get().lang}?service=search`);
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
        if (!res) {
            audioSocket.close()
            set({ audioSocket: null });
            set({ llmSocket: null});
            set({ canSpeak: false });
        }
        else {
            // TODO: ADD THE AWAIT ON 'speak' MESSAGE AND SEE IF IT'S ANY USEFUL
            set({ audioSocket });
            set({ canSpeak: true});
            return audioSocket
        }
    },
    connectLlmSocket: async () => {
        if (get().llmSocket?.readyState === WebSocket.OPEN) {
            get().llmSocket?.close()
        }
        const llmSocket = new WebSocket(`${BASE_SOCKET_URL}/ws/llm/search`);
        const res = await new Promise((resolve, reject) => {
            llmSocket.onopen = () => {
                console.log("LLM WebSocket connected!");
                resolve(true)
            }
            // here, an error would mean a connection error
            llmSocket.onerror = () => {
                reject(false)
            }
        })
        if (res) {
            set({ llmSocket });
            return llmSocket
        }
        else {
            llmSocket.close();
            set({ llmSocket: null});
            set({ canSpeak: false});
        }
    },
    disconnectAudioSocket: () => {
        const skt = get().audioSocket
        if (skt?.readyState === WebSocket.OPEN) {
            skt.close();
        }
        set({ audioSocket: null });
    },
    disconnectLlmSocket: () => {
        const skt = get().llmSocket
        if (skt?.readyState === WebSocket.OPEN) {
            skt.close();
        }
        set({ llmSocket: null });
    },
}))