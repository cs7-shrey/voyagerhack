import React from "react";
import { useSearchStore } from "@/store/useSearchStore";
import { useTempFilterStore } from "@/store/useTempFilterStore";

import { formatDate, stateInitUsingQueryParams } from "@/lib/utils";
import HotelAmenityFilter from "./filterComponents/HotelAmenityFilter";
import HotelStarFilter from "./filterComponents/HotelStarFilter";
import { useNavigate } from "react-router";
import UserRatingFilter from "./filterComponents/UserRatingFilter";
import RoomAmenityFilter from "./filterComponents/RoomAmenityFilter";
import HotelPriceFilter from "./filterComponents/HotelPriceFilter";
import { generateCurrentFiltersAsString } from "@/lib/utils";
// import { useSearchParams } from "react-router";

interface Props {
    filterIconClick: () => void;
}
const Filters: React.FC<Props> = ({ filterIconClick }) => {
    const {
        queryTerm,
        checkIn,
        checkOut,
        propertyType,
        proximityCoordinate,
        setMinBudget,
        setMaxBudget,
        setUserRating,
        setHotelStar,
        setHotelAmenities,
        setRoomAmenities,
    } = useSearchStore();
    const navigate = useNavigate();
    const {
        tempMinBudget,
        tempMaxBudget,
        tempUserRating,
        tempHotelStar,
        tempHotelAmenities,
        tempRoomAmenities,
        // setTempMinBudget,
        // setTempMaxBudget,
        // setTempUserRating,
        // setTempHotelStar,
        // setTempHotelAmenities,
        // setTempRoomAmenities,
    } = useTempFilterStore();
    
    const handleApply = () => {
        setMinBudget(tempMinBudget);
        setMaxBudget(tempMaxBudget);
        setUserRating(tempUserRating);
        setHotelStar(tempHotelStar);
        setHotelAmenities(tempHotelAmenities);
        setRoomAmenities(tempRoomAmenities);

        filterIconClick();
        const filterString = JSON.stringify({
            checkIn: formatDate(checkIn),
            checkOut: formatDate(checkOut),
            minBudget: tempMinBudget,
            maxBudget: tempMaxBudget,
            userRating: tempUserRating,
            hotelStar: tempHotelStar,
            propertyType: propertyType,
            hotelAmenities: tempHotelAmenities,
            roomAmenities: tempRoomAmenities,
        })
        navigate(`/hotels?q=${queryTerm.place}&type=${queryTerm.type}&filters=${filterString}&proximityCoordinate${JSON.stringify(proximityCoordinate)}`);
        // const [searchParams] = useSearchParams();
        const searchParams = new URLSearchParams(window.location.search);
        stateInitUsingQueryParams(searchParams);
    }
    const handleReset = () => {}
    generateCurrentFiltersAsString();
    return (
        <div 
            className={`bg-primary w-full min-w-sm max-h-[70vh] rounded-lg shadow-md p-4 overflow-y-auto scrollbar-webkit scrollbar-thin`}>
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 lg:hidden" />          {/* drag indicator */}
            <div className="font-bold">All filters</div>
            <div>
                < HotelPriceFilter />
            </div>
            <div className="mt-4">
                <UserRatingFilter />
            </div>
            <div>
                <HotelStarFilter />
            </div>
            <div className="mt-4">
                <HotelAmenityFilter />
            </div>
            <div>
                <RoomAmenityFilter />
            </div>
            <div className="
                absolute bottom-0 left-0 right-0
                p-4
                border-t border-gray-200
                bg-primary
                rounded-b-lg
                flex gap-4
                shadow-[0_-2px_10px_rgba(0,0,0,0.1)]
            ">
                <button 
                    onClick={handleReset}
                    className="
                        flex-1 
                        px-4 py-2 
                        border border-gray-300 
                        rounded-md 
                        text-gray-700 
                        hover:bg-gray-50
                        transition-colors
                    "
                >
                    Reset
                </button>
                <button 
                    onClick={handleApply}
                    className="
                        flex-1 
                        px-4 py-2 
                        bg-blue-600 
                        text-white 
                        rounded-md 
                        hover:bg-blue-700
                        transition-colors
                    "
                >
                    Apply
                </button>
            </div>
        </div>
    );
};

export default Filters;
