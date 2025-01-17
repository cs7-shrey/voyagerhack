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
    // const setSelected = (text: string) => {
    //     if (text === "0+" && !hotelStarState[0].isSelected) {
    //         setHotelStarState(hotelStarState.map((star) => {
    //             return { ...star, isSelected: star.text === "0+" }
    //         }))
    //     }
    //     else if (text !== "0+" && hotelStarState[0].isSelected) {
    //         setHotelStarState(hotelStarState.map((star) => {
    //             if (star.text === "0+") {
    //                 return { ...star, isSelected: false }
    //             }
    //             return { ...star, isSelected: star.text === text }
    //         }
    //         ))
    //     }
    //     else {
    //         setHotelStarState(hotelStarState.map((star) => {
    //             if (star.text === text) {
    //                 return { ...star, isSelected: !star.isSelected }
    //             }
    //             return star;
    //         }))
    //     }
    // }
    useEffect(() => {
        console.log('ye run hua')
        const { setTempHotelStar } = useTempFilterStore.getState();
        const { hotelStar } = useSearchStore.getState();
        console.log("ye rahe hotel stars asli state wale", hotelStar);
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
    // log
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
                    />
                ))}
            </div>
        </div>
    )
}

export default HotelStarFilter;