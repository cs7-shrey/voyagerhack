import { create } from 'zustand'
import { type Hotel } from '@/components/HotelCard'

interface HotelStore {
    hotels: Hotel[],
    fromVoice: boolean,
    setHotels: (hotels: Hotel[]) => void
    setFromVoice: (fromVoice: boolean) => void
}

export const useHotelStore = create<HotelStore>((set) => ({
    hotels: [],
    fromVoice: false,
    setHotels: (hotels) => set({ hotels }),
    setFromVoice: (fromVoice) => set({ fromVoice }),
}))