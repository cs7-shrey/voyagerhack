import { create } from "zustand"

interface queryTerm {
    query: string;
    type: string;
}

export interface Amenity {
    name: string;
    code: string;
}
interface SearchStore {
    // queryTerm -> url element
    queryTerm: queryTerm;
    setQueryTerm: (queryTerm: queryTerm) => void;
    // search value -> state element
    searchValue: string;
    setSearchValue: (searchValue: string) => void;
    checkIn: Date;
    setCheckIn: (checkIn: Date) => void;
    checkOut: Date;
    setCheckOut: (checkOut: Date) => void;
    minBudget: number;
    setMinBudget: (minBudget: number) => void;
    maxBudget: number;
    setMaxBudget: (maxBudget: number) => void;
    hotelStar: number;
    setHotelStar: (hotelStar: number) => void;
    userRating: number;
    setUserRating: (userRating: number) => void;
    propertyType: string[];
    setPropertyType: (propertyType: string[]) => void;
    hotelAmenities: Amenity[];
    setHotelAmenities: (hotelAmenities: Amenity[]) => void;
    roomAmenities: Amenity[];
    setRoomAmenities: (roomAmenities: Amenity[]) => void;
}
export const useSearchStore = create<SearchStore>()((set) => ({
    searchValue: "",
    setSearchValue: (searchValue) => set({ searchValue }),
    queryTerm: { query: "", type: "" },
    setQueryTerm: (queryTerm) => set({ queryTerm }),
    checkIn: new Date(),
    setCheckIn: (checkIn) => set({ checkIn }),
    checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
    setCheckOut: (checkOut) => set({ checkOut }),
    minBudget: 0,
    setMinBudget: (minBudget) => set({ minBudget }),
    maxBudget: 50000,
    setMaxBudget: (maxBudget) => set({ maxBudget }),
    hotelStar: 0,
    setHotelStar: (hotelStar) => set({ hotelStar }),
    userRating: 0,
    setUserRating: (userRating) => set({ userRating }),
    propertyType: [],
    setPropertyType: (propertyType) => set({ propertyType }),
    hotelAmenities: [],
    setHotelAmenities: (hotelAmenities) => set({ hotelAmenities }),
    roomAmenities: [],
    setRoomAmenities: (roomAmenities) => set({ roomAmenities }),
}))