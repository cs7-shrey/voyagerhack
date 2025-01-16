import React, { useEffect, useState } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import { useTempFilterStore } from "@/store/useTempFilterStore";
import Slider from "./ui/Slider";
import "react-range-slider-input/dist/style.css";
import { formatAmount } from "@/lib/utils";
import NumberBox from "./ui/NumberBox";
import HotelAmenityCard from "./HotelAmenityCard";
import RoomAmenityCard from "./RoomAmenityCard";
import { type Amenity } from "@/store/useSearchStore";
import { getConstants } from "@/lib/utils";
import HotelStarFilter from "./filterComponents/HotelStarFilter";



// TODO: optimize and modularize this fucked up component 
interface Props {
    filterIconClick: () => void;
}
const Filters: React.FC<Props> = ({ filterIconClick }) => {
    const {
        setMinBudget,
        setMaxBudget,
        setUserRating,
        setHotelStar,
        setHotelAmenities,
        setRoomAmenities,
    } = useSearchStore();
    
    const {
        tempMinBudget,
        tempMaxBudget,
        tempUserRating,
        tempHotelStar,
        tempHotelAmenities,
        tempRoomAmenities,
        setTempMinBudget,
        setTempMaxBudget,
        // setTempUserRating,
        // setTempHotelStar,
        // setTempHotelAmenities,
        // setTempRoomAmenities,
    } = useTempFilterStore();

    const value: [number, number] = [tempMinBudget, tempMaxBudget];
    const [amenityList, setAmenityList] = useState<Amenity[]>([]);
    const [roomAmenityList, setRoomAmenityList] = useState<Amenity[]>([]);
    
    const [isZeroSelected, setIsZeroSelected] = useState(true);
    const [isThreeSelected, setIsThreeSelected] = useState(false);
    const [isFourSelected, setIsFourSelected] = useState(false);
    const [isFourPointFiveSelected, setIsFourPointFiveSelected] = useState(false);
    
    // utility functions used
    const setAllFalse = () => {
        setIsZeroSelected(false);
        setIsThreeSelected(false);
        setIsFourSelected(false);
        setIsFourPointFiveSelected(false);
    };
    const handleApply = () => {
        setMinBudget(tempMinBudget);
        setMaxBudget(tempMaxBudget);
        setUserRating(tempUserRating);
        setHotelStar(tempHotelStar);
        setHotelAmenities(tempHotelAmenities);
        setRoomAmenities(tempRoomAmenities);

        filterIconClick();
    }
    const handleReset = () => {}
    const setValue = (newValues: [number, number]) => {
        const [newMin, newMax] = newValues;
        if (newMin >= newMax) return;
        setTempMinBudget(newMin);
        setTempMaxBudget(newMax);
    };
    useEffect(() => {
        const getAmenities = async () => {
            const hotelAmenitiesFromServer = await getConstants("hotel_amenity");
            setAmenityList(hotelAmenitiesFromServer);
            const roomAmenitiesFromServer = await getConstants("room_amenity");
            setRoomAmenityList(roomAmenitiesFromServer);
        };
        getAmenities();
    }, []);
    useEffect(() => {
        setAllFalse();
        switch (tempUserRating) {
            case 0:
                setIsZeroSelected(true);
                break;
            case 3:
                setIsThreeSelected(true);
                break;
            case 4:
                setIsFourSelected(true);
                break;
            case 4.5:
                setIsFourPointFiveSelected(true);
                break;
        }
    }, [tempUserRating]);
    return (
        <div 
        className={`bg-primary w-full min-w-sm max-h-[70vh] rounded-lg shadow-md p-4 overflow-y-auto scrollbar-webkit scrollbar-thin`}>
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 lg:hidden" />          {/* drag indicator */}
            <div className="font-bold">All filters</div>
            <div className="font-bold mt-8">Price</div>
            <div className="mt-6">
                <Slider
                    min={0}
                    max={50000}
                    step={100}
                    defaultValue={[500, 10000]}
                    value={value}
                    onInput={setValue}
                    rangeSlideDisabled={true}
                />
            </div>
            <div className="flex justify-between text-secondary/50 text-sm mt-4">
                <div>{"₹" + formatAmount(tempMinBudget)}</div>
                <div>{"₹" + formatAmount(tempMaxBudget)}</div>
            </div>
            <div className="mt-4">
                <div className="my-2 font-bold">User Rating</div>
                <div className="flex  justify-between gap-4">
                    <NumberBox text="0+" isSelected={isZeroSelected} />
                    <NumberBox text="3+" isSelected={isThreeSelected} />
                    <NumberBox text="4+" isSelected={isFourSelected} />
                    <NumberBox text="4.5+" isSelected={isFourPointFiveSelected} />
                </div>
            </div>
            <div>
                <HotelStarFilter />
            </div>
            <div className="mt-4">
                <div className="mt-6 mb-1 px-1 font-bold">Amenities</div>
                <div>
                    {amenityList.map((amenity) => (
                        <HotelAmenityCard
                            key={amenity.code}
                            text={amenity.name}
                            code={amenity.code}
                        />
                    ))}
                </div>
            </div>
            <div>
                <div className="mt-6 mb-1 px-1 font-bold">Room Amenities</div>
                <div>
                    {roomAmenityList.map((amenity) => (
                        <RoomAmenityCard
                            key={amenity.code}
                            text={amenity.name}
                            code={amenity.code}
                        />
                    ))}
                </div>
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
