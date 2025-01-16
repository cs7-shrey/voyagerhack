import { useState, useEffect } from 'react'
import HotelStar from '../ui/HotelStar'
import { useTempFilterStore } from '@/store/useTempFilterStore';

const HotelStarFilter = () => {
    const [hotelStarState, setHotelStarState] = useState([
        { text: "0+", isSelected: true },
        { text: "2", isSelected: false },
        { text: "3", isSelected: false },
        { text: "4", isSelected: false },
        { text: "5", isSelected: false },
    ]);
    const setSelected = (text: string) => {
        if (text === "0+" && !hotelStarState[0].isSelected) {
            setHotelStarState(hotelStarState.map((star) => {
                return { ...star, isSelected: star.text === "0+" }
            }))
        }
        else if (text !== "0+" && hotelStarState[0].isSelected) {
            setHotelStarState(hotelStarState.map((star) => {
                if (star.text === "0+") {
                    return { ...star, isSelected: false }
                }
                return { ...star, isSelected: star.text === text }
            }
            ))
        }
        else {
            setHotelStarState(hotelStarState.map((star) => {
                if (star.text === text) {
                    return { ...star, isSelected: !star.isSelected }
                }
                return star;
            }))
        }
    }
    useEffect(() => {
        const { setTempHotelStar } = useTempFilterStore.getState();
        if (hotelStarState[0].isSelected) {
            setTempHotelStar([0, 1, 2, 3, 4, 5]);
        }
        else {
            setTempHotelStar(hotelStarState.filter((star) => star.isSelected).map((star) => parseInt(star.text)));
        }
        console.log(hotelStarState)
    }, [hotelStarState])
    // log
    const { tempHotelStar } = useTempFilterStore();
    useEffect(() => {
        console.log(tempHotelStar);
    }, [tempHotelStar]);
    return (
        <div>
            <div className="mt-4 mb-2 font-bold">Hotel Class</div>
            <div className="flex gap-2">
                {hotelStarState.map((star) => (
                    <HotelStar
                        key={star.text}
                        text={star.text}
                        selected={star.isSelected}
                        setSelected={setSelected}
                    />
                ))}
            </div>
        </div>
    )
}

export default HotelStarFilter;