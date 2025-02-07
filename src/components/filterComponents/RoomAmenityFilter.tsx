import { useEffect, useState } from 'react'
import { getConstants } from '@/lib/utils';
import { useSearchStore, type Amenity } from '@/store/useSearchStore';
import RoomAmenityCard from '../RoomAmenityCard';
import { type AmenityUI } from './HotelAmenityFilter';
import { useTempFilterStore } from '@/store/useTempFilterStore';

const RoomAmenityFilter = () => {
    const [amenityList, setAmenityList] = useState<AmenityUI[]>([]);
    const { tempRoomAmenities, setTempRoomAmenities } = useTempFilterStore();
    useEffect(() => {
        // const { roomAmenities } = useSearchStore.getState();
        const { roomAmenities } = useSearchStore.getState();
        setTempRoomAmenities(roomAmenities);
    }, [setTempRoomAmenities]);

    useEffect(() => {
        const getRoomAmenities = async () => {
            let roomAmenitiesFromLocal: Amenity[] = JSON.parse(localStorage.getItem("rooomAmenities") || "[]");

            if (roomAmenitiesFromLocal.length === 0) {
                const roomAmenitiesFromServer = await getConstants("room_amenity");
                localStorage.setItem("roomAmenities", JSON.stringify(roomAmenitiesFromServer));
                roomAmenitiesFromLocal = roomAmenitiesFromServer
            }
            setAmenityList(roomAmenitiesFromLocal.map((amen) => {
                return {...amen, isChecked: tempRoomAmenities.some(obj => obj.code === amen.code)}
            }));
        };
        getRoomAmenities();

    }, [tempRoomAmenities])
    return (
        <>
            <div className="mt-6 mb-1 px-1 font-bold">Room Amenities</div>
            <div>
                {amenityList.map((amenity) => (
                    <RoomAmenityCard
                        key={amenity.code}
                        text={amenity.name ?? ''}
                        code={amenity.code}
                        isChecked={amenity.isChecked}
                    />
                ))}
            </div>
        </>
    )
}

export default RoomAmenityFilter
