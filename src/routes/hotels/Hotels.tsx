import HotelCard from "../../components/HotelCard";
import { useSearchParams } from "react-router";
import { axiosInstance } from "../../lib/axiosConfig";
import type { Hotel } from "../../components/HotelCard";
import { useState, useEffect } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import { formatDate, getConstants } from "@/lib/utils";


export default function Hotels() {
    const [searchParams] = useSearchParams();
    // some fetch call to the db to get hotels
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const {
        // searchValue,
        checkIn,
        checkOut,
        minBudget,
        maxBudget,
        hotelStar,
        userRating,
        propertyType,
        hotelAmenities,
        roomAmenities,  
        // setPropertyType,
    } = useSearchStore()

    useEffect(() => {
        const { propertyType, setPropertyType } = useSearchStore.getState();
        const getPropertyTypes = async () => {
            if (propertyType.length === 0) {
                const propertyTypes = await getConstants("property_type");
                setPropertyType(propertyTypes.map((type) => type.name));
            }
        };
        getPropertyTypes();
    }, []); // Run once on mount

    useEffect(() => {
    }, []);
    useEffect(() => {
        const q = searchParams.get("q");
        const type = searchParams.get("type");
        const getHotels = async () => {
            const data = {
                place: {
                    name: q,
                    type: type
                },
                check_in: formatDate(checkIn),
                check_out: formatDate(checkOut),
                min_budget: minBudget,
                max_budget: maxBudget,
                hotel_star: hotelStar,
                user_rating: userRating,
                property_type: propertyType,
                hotel_amenity_codes: hotelAmenities.map((amenity) => amenity.code),
                room_amenity_codes: roomAmenities.map((amenity) => amenity.code),
            }
            try {
                const response = await axiosInstance.post("/search/hotels", data, {
                    params: {
                        search_term: q,
                        type,
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                    
                });
                if (response.status !== 200) {
                    new Error("Failed to fetch hotels");
                }
                console.log(response.data);
                setHotels(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        if (propertyType.length > 0) {
            getHotels();
        }
    }, [
        propertyType, // Add propertyType as dependency
        checkIn,
        checkOut,
        minBudget,
        maxBudget,
        hotelStar,
        userRating,
        hotelAmenities,
        roomAmenities,
        searchParams,
    ]);

    return (
        <div>
            <nav className="bg-accent p-4">
                <h1>Hotels</h1>
            </nav>
            <div className="bg-[#212121] p-4">sort by:</div>
            <div className="grid grid-cols-4 p-8 bg-[#EFF3F8]">
                <div className="col-span-2 col-start-2 flex flex-col gap-4">
                    {hotels.map((hotel) => (
                        <HotelCard key={hotel.id} {...hotel} />
                    ))}
                </div>
            </div>
        </div>
    );
}
