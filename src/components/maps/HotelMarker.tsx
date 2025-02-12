import { useHotelStore } from '@/store/useHotelStore'
import React from 'react'

interface Props {
    price: number
    hotelId: string
}

const HotelMarker: React.FC<Props> = ({ price, hotelId }) => {
    const isSelected = hotelId === useHotelStore().selectedHotelId;
    const { setSelectedHotelId } = useHotelStore();
    const handeClick = () => {
        const element = document.getElementById(String(hotelId));
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center',
            });
        }
        setSelectedHotelId(hotelId);
    }
    return (
        <button 
            className={`
                font-semibold text-[1rem] p-2 rounded-lg shadow-md
                ${isSelected ? 'bg-accent text-white' : 'bg-primary text-secondary'}
                `}
            onClick={handeClick}
        >
            ₹ {price}
        </button>
    )
}

export default HotelMarker
