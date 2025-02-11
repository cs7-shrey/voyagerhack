import HotelCard from "../../components/HotelCard";
import { useNavigate, useSearchParams } from "react-router";
import { axiosInstance } from "../../lib/axiosConfig";
import Filters from "@/components/Filters";
import { useState, useEffect } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import { formatDate } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";
import { stateInitUsingQueryParams } from "@/lib/utils";   
import GoogleMaps  from "@/components/maps/GoogleMaps";
import { HashLoader } from "react-spinners"
import { useHotelStore } from "@/store/useHotelStore";
import TopBar from "@/components/TopBar";
import { useSocketStore } from "@/store/useSocketStore";
import NotFoundCard from "@/components/ui/NotFoundCard";

export default function Hotels() {
    const [filtersDropdown, setFiltersDropdown] = useState(false);
    const { waitingForMessage } = useSocketStore();
    // const [hotels, setHotels] = useState<Hotel[]>([]);
    const { hotels, setHotels } = useHotelStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
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
            return;
        }
        console.log('manual search')
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
            proximityCoordinate,
            // setPropertyType,
        } = useSearchStore.getState();
        setLoading(true)
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
                proximity_coordinate: proximityCoordinate ?? null
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
                setHotels(response.data.hotels);
            } catch (error) {
                console.error(error);
                setHotels([])
            } finally {
                setLoading(false);
            }
        }
        getHotels();
    }, [searchParams, navigate, setHotels]);

    useEffect(() => {
        if (waitingForMessage) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [waitingForMessage]);
    console.log(!hotels && !loading && !waitingForMessage)
    return (
        <div className="relative"
        >
            <nav className="bg-accent px-4 sm:sticky sm:top-0 z-50">
                <TopBar />
            </nav>
            <div className="relative lg:relative sm:flex md:grid md:grid-cols-12 px-4 sm:px-8 bg-[#EFF3F8] min-h-screen"               /*bg-[#EFF3F8] */
            >   
                <div className="col-span-2 overflow-y-auto md:col-start-2 md:col-span-10 lg:col-start-1 lg:col-span-7 flex flex-col gap-4">
                    <div className="p-4 relative z-20">
                        <button
                            onClick={filtersClick}
                            className="relative z-30 flex gap-2 px-4 items-center bg-accentForeground p-2 rounded-md text-primary"
                        >
                            <SlidersHorizontal size={18} strokeWidth={2} color="white" />
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
                    <div className='flex flex-col gap-4 relative'>
                        {hotels.map((hotel) => (
                            <HotelCard key={hotel.id} {...hotel} />
                        ))}
                        {hotels.length === 0 && !loading && !waitingForMessage && 
                        <div className='absolute inset-0'>
                            <NotFoundCard text="we couldn't find any hotels that match your criteria" />
                        </div>}
                    </div>
                </div>
                {loading && <div className="fixed inset-0 top-0 left-0 z-50 flex justify-center items-center bg-secondary/50">
                    <HashLoader />
                </div>}
                {/* Google Maps container */}
                <div className="hidden lg:block z-10 lg:col-start-8 ml-4 lg:col-span-5">
                    <div className="sticky top-24 z-20 h-[calc(100vh-6rem)]">
                        <GoogleMaps />
                    </div>
                </div>
            </div>
            {waitingForMessage && <div className="fixed inset-0 top-0 left-0 z-50 flex justify-center items-center bg-secondary/50">
                <HashLoader />
            </div>}
        </div>
    );
}