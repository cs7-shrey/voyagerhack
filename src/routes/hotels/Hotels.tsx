import HotelCard from "../../components/HotelCard";
import { useSearchParams } from "react-router";
import { axiosInstance } from "../../lib/axiosConfig";
import type { Hotel } from "../../components/HotelCard";
import Filters from "@/components/Filters";
import { useState, useEffect } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import { formatDate, getConstants } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";


export default function Hotels() {
    const [filtersDropdown, setFiltersDropdown] = useState(false);
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [searchParams] = useSearchParams();
    // some fetch call to the db to get hotels
    const filtersClick = () => {
        setFiltersDropdown((prev) => !prev);
    }
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
        <div className="relative">
            <nav className="bg-accent p-4">
                <h1>Hotels</h1>
            </nav>
            <div className="bg-[#212121] p-4 relative z-20">
                <button
                    onClick={filtersClick}
                    className="relative z-30"
                >
                    <SlidersHorizontal size={21} strokeWidth={0.75} color="white" />
                </button>
                {filtersDropdown && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/20 z-30"
                            onClick={filtersClick}
                        />
                        <div className="fixed lg:absolute bottom-0 lg:bottom-auto left-0 right-0 lg:left-4 lg:right-auto lg:top-full z-40 transform transition-transform duration-300 ease-in-out">
                            <Filters />
                        </div>
                    </>
                )}
            </div>
            <div className="sm:flex md:grid md:grid-cols-12 p-4 sm:p-8 bg-[#EFF3F8]">
                <div className="col-span-2  md:col-start-2 md:col-span-10 lg:col-start-3 lg:col-span-8 flex flex-col gap-4">
                    {hotels.map((hotel) => (
                        <HotelCard key={hotel.id} {...hotel} />
                    ))}
                </div>
            </div>
        </div>
    );
}

/*
            <div className="bg-[#212121] p-4 relative z-20">
                <button 
                    onClick={filtersClick}
                    className="relative z-30"
                >
                    <SlidersHorizontal size={21} strokeWidth={0.75} color="white" />
                </button>
                {filtersDropdown && (
                    <>
                        <div 
                            className="fixed inset-0 bg-black/20 z-30"
                            onClick={filtersClick}
                        />
                        <div className="absolute left-0 right-0 sm:left-4 sm:right-auto top-full z-40">
                            <Filters />
                        </div>
                    </>
                )}
            </div>
*/
