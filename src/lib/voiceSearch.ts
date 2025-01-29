import { useHotelStore } from "@/store/useHotelStore";
import { useNavigate } from "react-router";
import { type Hotel } from "@/components/HotelCard";
import { useSearchStore } from "@/store/useSearchStore";
import toast from "react-hot-toast";
import { stat } from "fs";

interface Place {
    name: string;
    type: string;
} 
interface BackendFilters {
    place: Place;
    check_in: string;
    check_out: string;
    min_budget: number;
    max_budget: number;
    user_rating: number;
    hotel_star: number;
    property_type: string[];
    hotel_amenity_codes: string[];
    room_amenity_codes: string[];
}
interface Status {
    code: number    
    message: string 
}

export function useLllmFilters() {
    const navigate = useNavigate()
    const { setHotels, setFromVoice } = useHotelStore()
    const { setSearchValue } = useSearchStore();
    const processLlmFilters = (filters: BackendFilters, status: Status, hotelData: Hotel[]) => {
        console.log(status.code, status.message)
        if (status.code !== 200) {
            // set some errors
            // alert(status.message)
            toast(status.message, {
                icon: '🤠',
                removeDelay: 3000
                // style: {
                //     "color": "#0062E3"
                // }
            })
            return
        }
        const queryTerm = filters.place?.name;
        setSearchValue(queryTerm)
        const type = filters.place?.type;
        const searchFilters = {
            checkIn: filters?.check_in,
            checkOut: filters?.check_out,
            minBudget: filters?.min_budget,
            maxBudget: filters?.max_budget,
            userRating: filters?.user_rating,
            hotelStar: filters?.hotel_star,
            propertyType: filters?.property_type,
            hotelAmenities: filters?.hotel_amenity_codes?.map((code) => ({code: code})),
            roomAmenities: filters?.room_amenity_codes?.map((code) => ({code: code})),
        }
        const filterString = JSON.stringify(searchFilters);
        setHotels(hotelData);
        setFromVoice(true);
        navigate(`/hotels?q=${queryTerm}&type=${type}&filters=${filterString}`);
    }
    return processLlmFilters
}