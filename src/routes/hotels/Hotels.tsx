import HotelCard from "../../components/HotelCard";
import { useNavigate, useSearchParams } from "react-router";
import { axiosInstance } from "../../lib/axiosConfig";
import Filters from "@/components/Filters";
import { useState, useEffect } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import { formatDate } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";
import { stateInitUsingQueryParams } from "@/lib/utils";   
// import { 
    // Mic,     
    //  MicOff 
    // } from "lucide-react";
import { useHotelStore } from "@/store/useHotelStore";
import TopBar from "@/components/TopBar";

export default function Hotels() {
    const [filtersDropdown, setFiltersDropdown] = useState(false);
    // const [hotels, setHotels] = useState<Hotel[]>([]);
    const { hotels, setHotels } = useHotelStore();
    const navigate = useNavigate()
    // searchParams.
    // some fetch call to the db to get hotels
    const filtersClick = () => {
        setFiltersDropdown((prev) => !prev);
    }
    // const { queryTerm } = useSearchStore();
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const { fromVoice, setFromVoice } = useHotelStore.getState(); 
        stateInitUsingQueryParams(searchParams);
        if (fromVoice) {
            setFromVoice(false);
            console.log('it was from voice. going back')
            return;
        }
        console.log("it was not from voice. going to fetch")
        const {
            queryTerm,
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
        } = useSearchStore.getState();
        const x = searchParams.get("x");
        console.log(x);
        const q = searchParams.get("q");
        const type = searchParams.get("type");
        const getHotels = async () => {
            const data = {
                place: {
                    name: queryTerm.place,
                    type: queryTerm.type
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
                console.log("ye hai hotels ka api response", response.data);
                setHotels(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        getHotels();
    }, [searchParams, navigate, setHotels]);

    // test
    useEffect(() => {
        console.log('mounted')
    }, [])
    return (
        <div className="relative">
            <nav className="bg-accent px-4 abolute sticky">
                <TopBar />
            </nav>
            <div className="p-4 relative z-20">
                <button
                    onClick={filtersClick}
                    className="relative z-30 flex gap-2 bg-accentForeground p-2 rounded-md text-primary"
                >
                    <SlidersHorizontal size={21} strokeWidth={0.75} color="white" />
                    Filters
                </button>
                {filtersDropdown && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/20 z-30"
                            onClick={filtersClick}
                        />
                        <div className="fixed lg:absolute bottom-0 lg:bottom-auto left-0 right-0 lg:left-4 lg:right-auto lg:top-full z-40 transform transition-transform duration-300 ease-in-out">
                            <Filters filterIconClick={filtersClick}/>
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