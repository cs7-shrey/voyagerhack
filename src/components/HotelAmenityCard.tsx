import React, { useEffect, useState } from 'react';
import AmenityCard from './ui/AmenityCard';
import { useTempFilterStore } from '@/store/useTempFilterStore';

interface Props {
    text: string;
    code: string;
}
const HotelAmenityCard: React.FC<Props> = ({ text, code }) => {
    const [isChecked, setIsChecked] = useState(false);
    const onClick = () => {
        console.log('clicked');
        setIsChecked(!isChecked);
    }
    useEffect(() => {
        const { tempHotelAmenities, setTempHotelAmenities } = useTempFilterStore.getState();
        if (isChecked) {
            setTempHotelAmenities([...tempHotelAmenities, { name: text, code }]);
        } else {
            setTempHotelAmenities(tempHotelAmenities.filter((amenity) => amenity.code !== code));
        }
    }, [isChecked, code, text]);
    return (
        <AmenityCard text={text} isChecked={isChecked} handleClick={onClick} />
    );
};

export default HotelAmenityCard;