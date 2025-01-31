import { create } from 'zustand'
import { type Hotel } from '@/components/HotelCard'

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