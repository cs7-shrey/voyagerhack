import { useTempFilterStore } from "@/store/useTempFilterStore";
import { Star } from "lucide-react";
import React from "react";

interface Props {
  text: string;
  selected: boolean;
}
const HotelStar: React.FC<Props> = ({ text, selected }) => {
    const { tempHotelStar, setTempHotelStar } = useTempFilterStore();
    const handleClick = () => {
    // setSelected(text);
        if (!selected && text === "0+") {
            setTempHotelStar([0, 1, 2, 3, 4, 5]);
        } else if (selected && text === "0+") {
            return;
        } else {
            // text is not 0+
            if (tempHotelStar[0] === 0) {
                setTempHotelStar([parseInt(text)]);
            } else {
                if (selected && tempHotelStar.includes(parseInt(text))) {
                    setTempHotelStar(
                        tempHotelStar.filter((star) => star !== parseInt(text))
                    );
                } else if (!selected && !tempHotelStar.includes(parseInt(text))) {
                    setTempHotelStar([...tempHotelStar, parseInt(text)]);
                }
            }
        }
    };
    return (
        <button onClick={handleClick}>
            <div className="relative w-fit">
                <Star
                    size={55}
                    color={`${selected ? "#363f45" : "#e1e5e9"}`}
                    fill={`${selected ? "#363f45" : "#ffffff"}`}
                />
                <div className={`absolute top-0 left-0  w-full h-full flex items-center justify-center ${selected ? "text-primary" : "text-secondary"} font-bold text-xs`}>
                    {text}
                </div>
            </div>
        </button>
    );
};

export default HotelStar;
