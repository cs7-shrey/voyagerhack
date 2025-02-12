import { create } from 'zustand'

export interface Hotel {
    id: string;
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
    selectedHotelId: string | null;
    setHotels: (hotels: Hotel[]) => void
    setFromVoice: (fromVoice: boolean) => void
    setInfoMessage: ( infoMessage: string) => void
    setSelectedHotelId: (hotelId: string) => void
}

export const useHotelStore = create<HotelStore>((set) => ({
    hotels: [],
    fromVoice: false,
    infoMessage: '',
    selectedHotelId: null,
    setHotels: (hotels) => {
        set({ hotels, selectedHotelId: hotels?.[0]?.id })
    },
    setFromVoice: (fromVoice) => set({ fromVoice }),
    setInfoMessage: ( infoMessage ) => set({ infoMessage }),
    setSelectedHotelId: (hotelId) => set({ selectedHotelId: hotelId })
}))