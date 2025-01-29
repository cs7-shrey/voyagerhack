import { create } from 'zustand'
import { axiosInstance } from '@/lib/axiosConfig';
interface HotelData {
    id: bigint;
    gi_id: bigint;
    name: string;
    location: string;
    hotelStar: number;
    userRating: number;
    userRatingCount: number;
    propertyType: string;
    images: string[];
    amenities: string[];
}

export interface RatePlan {
    plan_id: bigint;
    pay_mode: string;
    base_fare: number;
    total_discount: number;
    taxes: number;
    filter_code: string[];
}
interface Beds {
    type: string;
    count: number;
    bed_type_key: string | null | undefined;
}
export interface RoomType {
    room_type_id: number;
    room_type_name: string;
    room_photos: string[];
    max_guests: number;
    max_adults: number;
    max_children: number;
    beds: Beds[] | undefined;
    display_amenities: string[];
    rate_plans: RatePlan[];
}

interface HotelDescStore {
    hotelData: HotelData | null;
    roomData: RoomType[]| null;
    setHotelData: (data: HotelData | null) => void;
    setRoomData: (data: RoomType[] | null) => void;
    getHotelData: (id: bigint) => Promise<void>;
    getRoomData: (id: bigint) => Promise<void>;
}

export const useHotelDescStore = create<HotelDescStore>()((set) => ({
    hotelData: null,
    roomData: null,
    setHotelData: (data) => set({ hotelData: data }),
    setRoomData: (data) => set({ roomData: data }),
    getHotelData : async (id)  => {
        // set({hotelData: null})
        console.log(id)
        try {
            const response = await axiosInstance.get(`/hotel/${id}`)
            set({ hotelData: {
                id: response.data.id,
                gi_id: response.data.gi_id,
                name: response.data.name,
                location: response.data.location,
                hotelStar: response.data.hotel_star,
                userRating: response.data.user_rating,
                userRatingCount: response.data.user_rating_count,
                propertyType: response.data.property_type,
                images: response.data.images,
                amenities: response.data.amenities
            } })
        } catch (error) {
            console.log("Error fetching hotel data: ", error)
        }
    },   
    getRoomData: async (id) => {
        // set({roomData: []})
        try {
            const response= await axiosInstance.get(`/hotel/${id}/rooms`)
            console.log(response.data)
            const data = response.data
            response.data.forEach((room: RoomType) => {
                room.rate_plans.sort((a: RatePlan, b: RatePlan) => a.base_fare - b.base_fare)
            })
            
            set({ roomData: data })
                // console.log(response.data)
        } catch (error) {
            console.log("Error fetching room data: ", error)                
        }
    }
}))
