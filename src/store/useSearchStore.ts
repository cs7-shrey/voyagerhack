import { create } from "zustand"

export interface queryTerm {
    place: string;
    type: string;
}
export interface ProximityCoordinate {
    latitude: number;
    longitude: number;
}
export interface Amenity {
    name?: string;
    code: string;
}
interface SearchStore {
    // queryTerm -> url element
    queryTerm: queryTerm;       // used to query the database
    // search value -> state element
    searchValue: string;        // used to get search suggestions
    checkIn: Date;
    checkOut: Date;
    minBudget: number;
    maxBudget: number;
    hotelStar: number[];
    userRating: number;
    propertyType: string[];
    hotelAmenities: Amenity[];
    roomAmenities: Amenity[];
    proximityCoordinate: ProximityCoordinate | null;
    
    setQueryTerm: (queryTerm: queryTerm) => void;
    setSearchValue: (searchValue: string) => void;
    setCheckIn: (checkIn: Date) => void;
    setCheckOut: (checkOut: Date) => void;
    setMinBudget: (minBudget: number) => void;
    setMaxBudget: (maxBudget: number) => void;
    setHotelStar: (hotelStar: number[]) => void;
    setUserRating: (userRating: number) => void;
    setPropertyType: (propertyType: string[]) => void;
    setHotelAmenities: (hotelAmenities: Amenity[]) => void;
    setRoomAmenities: (roomAmenities: Amenity[]) => void;
    setProximityCoordinate: ( proximityCoordinate: ProximityCoordinate | null) => void
}
export const useSearchStore = create<SearchStore>()((set) => ({
    searchValue: "",
    queryTerm: { place: "", type: "" },
    checkIn: new Date(),
    checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
    minBudget: 0,
    maxBudget: 50000,
    hotelStar: [0, 1, 2, 3, 4, 5],
    userRating: 0,
    propertyType: [],
    hotelAmenities: [],
    roomAmenities: [],
    proximityCoordinate: null,
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
    setProximityCoordinate: (proximityCoordinate) => set({ proximityCoordinate })
}))