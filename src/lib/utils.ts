import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { axiosInstance } from "./axiosConfig"
import { type Amenity } from "../store/useSearchStore"

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