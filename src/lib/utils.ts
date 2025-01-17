import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { axiosInstance } from "./axiosConfig"
import { type queryTerm, type Amenity } from "../store/useSearchStore"
import { useSearchStore } from "../store/useSearchStore"

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
    console.log("Error fetching: ", type,  error)
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
  roomAmenities: Amenity[] 
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
    setRoomAmenities 
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
}

export function stateInitUsingQueryParams(searchParams: URLSearchParams) {
  // const [searchParams] = useSearchParams();
  // TODO: optimize redundant checks
  const q = searchParams.get("q");
  const type = searchParams.get("type");
  const checkInDate = searchParams.get("checkIn");
  const checkOutDate = searchParams.get("checkOut");
  const filters = JSON.parse(searchParams.get("filters") || "{}");
  const checkIn = checkInDate ? new Date(checkInDate) : new Date();
  const checkOut = checkOutDate ? new Date(checkOutDate) : new Date(new Date().setDate(new Date().getDate() + 1));
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
    filters.roomAmenities || []
  )
}