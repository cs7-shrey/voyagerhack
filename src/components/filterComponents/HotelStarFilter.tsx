import { useState, useEffect } from 'react'
import HotelStar from '../ui/HotelStar'
import { useTempFilterStore } from '@/store/useTempFilterStore';
import { useSearchStore } from '@/store/useSearchStore';

const HotelStarFilter = () => {
    const [hotelStarState, setHotelStarState] = useState([
        { text: "0+", isSelected: true },
        { text: "2", isSelected: false },
        { text: "3", isSelected: false },
        { text: "4", isSelected: false },
        { text: "5", isSelected: false },
    ]);
    useEffect(() => {
        const { setTempHotelStar } = useTempFilterStore.getState();
        const { hotelStar } = useSearchStore.getState();
        setTempHotelStar(hotelStar);
    }, [])
    const { tempHotelStar } = useTempFilterStore();
    useEffect(() => {
        if (tempHotelStar[0] === 0) {
            setHotelStarState((prev) => {
                return prev.map((star) => {
                    return { ...star, isSelected: star.text === "0+" }
                })
            })
        }
        else {
            setHotelStarState((prev) => {
                return prev.map((star) => {
                    return { ...star, isSelected: tempHotelStar.includes(parseInt(star.text)) }
                })
            })
        }

    }, [tempHotelStar])
    
    return (
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
    )
}

export default HotelStarFilter;