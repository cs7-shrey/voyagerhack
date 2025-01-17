import React from 'react';
import AmenityCard from './ui/AmenityCard';
import { useTempFilterStore } from '@/store/useTempFilterStore';

interface Props {
    text: string;
    code: string;
    isChecked: boolean;
}
const RoomAmenityCard: React.FC<Props> = ({ text, code, isChecked }) => {
    const { tempRoomAmenities, setTempRoomAmenities } = useTempFilterStore();
    const onClick = () => {
        if (!isChecked) {
            setTempRoomAmenities([...tempRoomAmenities, {name: text, code: code}]);
        }
        else {
            setTempRoomAmenities(tempRoomAmenities.filter((amen) => amen.code !== code))
        }
    }
    return (
        <AmenityCard text={text} isChecked={isChecked} handleClick={onClick} />
    );
};

export default RoomAmenityCard;