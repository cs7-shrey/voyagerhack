import { useEffect, useState } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import Slider from "./ui/Slider";
import "react-range-slider-input/dist/style.css";
import { formatAmount } from "@/lib/utils";
import NumberBox from "./ui/NumberBox";
import HotelAmenityCard from "./HotelAmenityCard";
import RoomAmenityCard from "./RoomAmenityCard";
import { type Amenity } from "@/store/useSearchStore";
import { getConstants } from "@/lib/utils";
import HotelStar from "./ui/HotelStar";


const Filters = () => {
    const {
        minBudget,
        maxBudget,
        setMinBudget,
        setMaxBudget,
        userRating,
        // hotelAmenities,
        roomAmenities,
        hotelStar,
    } = useSearchStore();
    const value: [number, number] = [minBudget, maxBudget];
    const [amenityList, setAmenityList] = useState<Amenity[]>([]);
    const [roomAmenityList, setRoomAmenityList] = useState<Amenity[]>([]);
    const [hotelStarState, setHotelStarState] = useState([
        { text: "0+", isSelected: false },
        { text: "2", isSelected: false },
        { text: "3", isSelected: false },
        { text: "4", isSelected: false },
        { text: "5", isSelected: false },
    ]);

    const [isZeroSelected, setIsZeroSelected] = useState(true);
    const [isThreeSelected, setIsThreeSelected] = useState(false);
    const [isFourSelected, setIsFourSelected] = useState(false);
    const [isFourPointFiveSelected, setIsFourPointFiveSelected] = useState(false);

    const setAllFalse = () => {
        setIsZeroSelected(false);
        setIsThreeSelected(false);
        setIsFourSelected(false);
        setIsFourPointFiveSelected(false);
    };

    useEffect(() => {
        const handleHotelStarState = () => {
            setHotelStarState((prev) => {
                return prev.map((star) => ({
                    ...star,
                    isSelected:
                        star.text === "0+"
                            ? hotelStar === 0
                            : hotelStar != 0 && hotelStar <= Number(star.text),
                }));
            });
        };
        handleHotelStarState();
    }, [hotelStar]);
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
        switch (userRating) {
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
    }, [userRating]);
    const setValue = (newValues: [number, number]) => {
        const [newMin, newMax] = newValues;
        if (newMin >= newMax) return;
        setMinBudget(newMin);
        setMaxBudget(newMax);
    };
    useEffect(() => {
        console.log(roomAmenities);
    }, [roomAmenities]);
    return (
        <div 
        className={`bg-primary w-full min-w-sm max-h-[80vh] rounded-lg shadow-md p-4 overflow-y-auto scrollbar-webkit scrollbar-thin`}>
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 lg:hidden" />
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
                <div>{"₹" + formatAmount(minBudget)}</div>
                <div>{"₹" + formatAmount(maxBudget)}</div>
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
                <div className="mt-4 mb-2 font-bold">Hotel Class</div>
                <div className="flex gap-2">
                    {hotelStarState.map((star) => (
                        <HotelStar
                            key={star.text}
                            text={star.text}
                            selected={star.isSelected}
                        />
                    ))}
                </div>
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
        </div>
    );
};

export default Filters;
