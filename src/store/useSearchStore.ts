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
    hotelStar: number[];
    setHotelStar: (hotelStar: number[]) => void;
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
    queryTerm: { query: "", type: "" },
    checkIn: new Date(),
    checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
    minBudget: 0,
    maxBudget: 50000,
    hotelStar: [0, 1, 2, 3, 4, 5],
    userRating: 0,
    propertyType: [],
    hotelAmenities: [],
    roomAmenities: [],
    setSearchValue: (searchValue) => set({ searchValue }),
    setQueryTerm: (queryTerm) => set({ queryTerm }),
    setCheckIn: (checkIn) => set({ checkIn }),
    setCheckOut: (checkOut) => set({ checkOut }),
    setMinBudget: (minBudget) => set({ minBudget }),
    setMaxBudget: (maxBudget) => set({ maxBudget }),
    setHotelStar: (hotelStar) => set({ hotelStar }),
    setUserRating: (userRating) => set({ userRating }),
    setPropertyType: (propertyType) => set({ propertyType }),
    setHotelAmenities: (hotelAmenities) => set({ hotelAmenities }),
    setRoomAmenities: (roomAmenities) => set({ roomAmenities }),
}))