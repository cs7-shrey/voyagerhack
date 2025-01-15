import React, { useEffect, useState } from 'react';
import { useSearchStore } from '@/store/useSearchStore';
import AmenityCard from './ui/AmenityCard';

interface Props {
    text: string;
    code: string;
}
const RoomAmenityCard: React.FC<Props> = ({ text, code }) => {
    const [isChecked, setIsChecked] = useState(false);
    const onClick = () => {
        console.log('clicked');
        setIsChecked(!isChecked);
    }
    useEffect(() => {
        // const { hotelAmenities, setHotelAmenities } = useSearchStore.getState();
        // if (isChecked) {
        //     setHotelAmenities([...hotelAmenities, { name: text, code }]);
        // } else {
        //     setHotelAmenities(hotelAmenities.filter((amenity) => amenity.code !== code));
        // }
        const { roomAmenities, setRoomAmenities } = useSearchStore.getState();
        if (isChecked) {
            setRoomAmenities([...roomAmenities, { name: text, code }]);
        } else {
            setRoomAmenities(roomAmenities.filter((amenity) => amenity.code !== code));
        }
    }, [isChecked, code, text]);
    return (
        <AmenityCard text={text} isChecked={isChecked} handleClick={onClick} />
    );
};

export default RoomAmenityCard;