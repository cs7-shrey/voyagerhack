import React, { useEffect, useState } from 'react';
import AmenityCard from './ui/AmenityCard';
import { useTempFilterStore } from '@/store/useTempFilterStore';

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
        const { tempRoomAmenities, setTempRoomAmenities } = useTempFilterStore.getState();
        if (isChecked) {
            setTempRoomAmenities([...tempRoomAmenities, { name: text, code }]);
        } else {
            setTempRoomAmenities(tempRoomAmenities.filter((amenity) => amenity.code !== code));
        }
    }, [isChecked, code, text]);
    return (
        <AmenityCard text={text} isChecked={isChecked} handleClick={onClick} />
    );
};

export default RoomAmenityCard;