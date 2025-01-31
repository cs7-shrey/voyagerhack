import React from 'react';
import AmenityCard from './ui/AmenityCard';
import { useTempFilterStore } from '@/store/useTempFilterStore';

interface Props {
    text: string;
    code: string;
    isChecked: boolean;
}
const HotelAmenityCard: React.FC<Props> = ({ text, code, isChecked }) => {
    // const [isChecked, setIsChecked] = useState(false);
    const { tempHotelAmenities, setTempHotelAmenities } = useTempFilterStore();
    const onClick = () => {
        if (!isChecked) {
            setTempHotelAmenities([...tempHotelAmenities, {name: text, code: code}]);
        }
        else {
            setTempHotelAmenities(tempHotelAmenities.filter((amen) => amen.code !== code))
        }
    }
    return (
        <AmenityCard text={text} isChecked={isChecked} handleClick={onClick} />
    );
};

export default HotelAmenityCard;