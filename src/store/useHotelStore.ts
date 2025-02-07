import { create } from 'zustand'

export interface Hotel {
    id: bigint;
    name: string;
    location: string;
    base_fare?: number;
    images?: string[];
    hotel_star?: number;
    user_rating?: number;
    user_rating_count?: number;
    latitude: number;
    longitude: number;
}
interface HotelStore {
    hotels: Hotel[];
    fromVoice: boolean;
    infoMessage: string;
    setHotels: (hotels: Hotel[]) => void
    setFromVoice: (fromVoice: boolean) => void
    setInfoMessage: ( infoMessage: string) => void
}

export const useHotelStore = create<HotelStore>((set) => ({
    hotels: [],
    fromVoice: false,
    infoMessage: '',
    setHotels: (hotels) => set({ hotels }),
    setFromVoice: (fromVoice) => set({ fromVoice }),
    setInfoMessage: ( infoMessage ) => set({ infoMessage })
}))