import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { axiosInstance } from "./axiosConfig"
import { type queryTerm, type Amenity, type ProximityCoordinate } from "../store/useSearchStore"
import { useSearchStore } from "../store/useSearchStore"
import { useHotelDescStore } from "@/store/useHotelDescStore"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export async function getConstants(type: "property_type" | "hotel_amenity" | "room_amenity"): Promise<Amenity[]> {
    try {
        const response = await axiosInstance.get(`/constants/${type}`)
        if (response.status !== 200) {
            throw new Error("Failed to fetch constants")
        }
        return response.data
    } catch (error) {
        console.error("Error fetching: ", type,  error)
        return []
    }
}


export function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
}

export function formatAmount(amount: number) {
    if (amount >= 1000) {
        const digits = String(amount).split("");
        digits.splice(digits.length - 3, 0, ",");
        return digits.join("");
    }
    else {
        return amount.toString();
    }
}

export function setInitialFiltersState(
    queryTerm: queryTerm ,
    checkIn: Date ,
    checkOut: Date ,
    minBudget: number ,
    maxBudget: number ,
    hotelStar: number[] ,
    userRating: number ,
    propertyType: string[] ,
    hotelAmenities: Amenity[] ,
    roomAmenities: Amenity[],
    proximityCoordinate: ProximityCoordinate | null
) {
    const { setQueryTerm, 
        setCheckIn, 
        setCheckOut, 
        setMinBudget, 
        setMaxBudget, 
        setHotelStar, 
        setUserRating, 
        setPropertyType, 
        setHotelAmenities, 
        setRoomAmenities,
        setProximityCoordinate
    } = useSearchStore.getState();
    setQueryTerm(queryTerm);
    setCheckIn(checkIn);
    setCheckOut(checkOut);
    setMinBudget(minBudget);
    setMaxBudget(maxBudget);
    setHotelStar(hotelStar);
    setUserRating(userRating);
    setPropertyType(propertyType);
    setHotelAmenities(hotelAmenities);
    setRoomAmenities(roomAmenities);
    setProximityCoordinate(proximityCoordinate)
}

export function stateInitUsingQueryParams(searchParams: URLSearchParams) {
    // const [searchParams] = useSearchParams();
    // TODO: optimize redundant checks
    const q = searchParams.get("q");
    const type = searchParams.get("type");
    const checkInDate = searchParams.get("checkIn");
    const checkOutDate = searchParams.get("checkOut");
    const filters = JSON.parse(searchParams.get("filters") || "{}");
    const proximityCoordinate = Object.keys(JSON.parse(searchParams.get("proximityCoordinate") || "{}") || {}).length > 0 ? JSON.parse(searchParams.get("proximityCoordinate") || "{}") : null
    const checkIn = checkInDate ? new Date(checkInDate) : new Date();
    const checkOut = checkOutDate ? new Date(checkOutDate) : new Date(new Date().setDate(new Date().getDate() + 1));
    console.log(proximityCoordinate)
    setInitialFiltersState(
        { place: q || "", type: type || "" },
        checkIn,
        checkOut,
        filters.minBudget || 0,
        filters.maxBudget || 50000,
        filters.hotelStar || [0, 1, 2, 3, 4, 5],
        filters.userRating || 0,
        filters.propertyType || [],
        filters.hotelAmenities || [],
        filters.roomAmenities || [],
        proximityCoordinate
    )
}

export function getHotelInfoFormatted() {
    const { hotelData, roomData } = useHotelDescStore.getState()
    // TODO: improve the format of the prompt
    const info =  `
    THIS IS THE BASIC HOTEL INFORMATION IN JSON FORMAT:
    ${JSON.stringify(
        {
            ...hotelData,
            images: null
        }
    )}

    THERE ARE THE ROOM OPTIONS THE HOTEL OFFERS WITH VARIOUS RATE PLANS:
    ${JSON.stringify(
        roomData?.map((room) => {
            return {
                ...room,
                room_photos: null,
                rate_plans: room.rate_plans.map((plan) => {
                    return {
                        ...plan,
                        total_discount: null
                    }
                })
            }
        })
    )}
  `
    return info
}

export function generateCurrentFiltersAsString() {
    const { 
        queryTerm, checkIn, checkOut, minBudget, maxBudget, userRating, hotelStar, propertyType, hotelAmenities, roomAmenities
    } = useSearchStore.getState()

    const filterString = `
    place: ${queryTerm.place}
    check_in: ${formatDate(checkIn)}
    check_out: ${formatDate(checkOut)}
    min_budget: ${minBudget}
    max_budget: ${maxBudget}
    user_rating: ${userRating}
    hotel_star: ${JSON.stringify(hotelStar)}
    property_type: ${propertyType.length > 0 ? JSON.stringify(propertyType) : JSON.stringify(propertyType) + " (Empty array means all available types)"}
    hotel_amenities: ${JSON.stringify(hotelAmenities.map((amenity) => amenity.code))}
    room_amenities: ${JSON.stringify(roomAmenities.map((amenity) => amenity.code))} 
   `
    return filterString
}

export function formatRoomOffer (filter_code: string[]) {

    if (filter_code.includes("FREE_BREAKFAST") && filter_code.includes("FREE_CANCELLATION")) {
        return "Free Breakfast | Free Cancellation"
    } 
    else if (filter_code.includes("FREE_BREAKFAST")) {
        return "Room Only | Free Breakfast"
    }
    else if (filter_code.includes("FREE_CANCELLATION")) {
        return "Room Only | Free Cancellation"
    }
    else {
        return "Room Only"
    }
}