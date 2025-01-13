import HotelCard from "../../components/HotelCard";
import { useSearchParams } from "react-router";
import { axiosInstance } from "../../lib/axiosConfig";
import type { Hotel } from "../../components/HotelCard";
import { useState, useEffect } from "react";

export default function Hotels() {
    const [searchParams] = useSearchParams();
    const q = searchParams.get("q");
    const type = searchParams.get("type");
    // some fetch call to the db to get hotels
    const [hotels, setHotels] = useState<Hotel[]>([]);

    useEffect(() => {
        const getHotels = async () => {
            try {
                const response = await axiosInstance.get("/search/hotels", {
                    params: {
                        search_term: q,
                        type,
                    },
                });
                if (response.status !== 200) {
                    new Error("Failed to fetch hotels");
                }
                setHotels(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        getHotels();
    }, [q, type]);

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
