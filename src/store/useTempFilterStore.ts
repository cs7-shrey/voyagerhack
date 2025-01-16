import { create } from "zustand";
import { type Amenity } from "./useSearchStore";
import { useSearchStore } from "./useSearchStore";

interface TempFilterStore {
    tempMinBudget: number;
    tempMaxBudget: number;
    tempUserRating: number;
    tempHotelStar: number[];
    tempHotelAmenities: Amenity[];
    tempRoomAmenities: Amenity[];

    setTempMinBudget: (tempMinBudget: number) => void;
    setTempMaxBudget: (tempMaxBudget: number) => void;
    setTempUserRating: (tempUserRating: number) => void;
    setTempHotelStar: (tempHotelStar: number[]) => void;
    setTempHotelAmenities: (tempHotelAmenities: Amenity[]) => void;
    setTempRoomAmenities: (tempRoomAmenities: Amenity[]) => void;
}    

const {
    minBudget,
    maxBudget,
    userRating,
    hotelStar,
    hotelAmenities,
    roomAmenities,
} = useSearchStore.getState();

export const useTempFilterStore = create<TempFilterStore>((set) => ({
    tempMinBudget: minBudget,
    tempMaxBudget: maxBudget,
    tempUserRating: userRating,
    tempHotelStar: hotelStar,
    tempHotelAmenities: hotelAmenities,
    tempRoomAmenities: roomAmenities,
    
    setTempMinBudget: (tempMinBudget) => set({ tempMinBudget }),
    setTempMaxBudget: (tempMaxBudget) => set({ tempMaxBudget }),
    setTempUserRating: (tempUserRating) => set({ tempUserRating }),
    setTempHotelStar: (tempHotelStar) => set({ tempHotelStar }),
    setTempHotelAmenities: (tempHotelAmenities) => set({ tempHotelAmenities }),
    setTempRoomAmenities: (tempRoomAmenities) => set({ tempRoomAmenities }),
}))
