import { useEffect, useState } from 'react'
import { getConstants } from '@/lib/utils'
import { useSearchStore, type Amenity } from '@/store/useSearchStore';
import HotelAmenityCard from '../HotelAmenityCard';
import { useTempFilterStore } from '@/store/useTempFilterStore';

export interface AmenityUI extends Amenity {
    isChecked: boolean;
}
const HotelAmenityFilter = () => {
    const [amenityList, setAmenityList] = useState<AmenityUI[]>([]);
    const { tempHotelAmenities, setTempHotelAmenities } = useTempFilterStore();
    useEffect(() => {
        const { hotelAmenities } = useSearchStore.getState();
        setTempHotelAmenities(hotelAmenities);
    }, [setTempHotelAmenities]);
    useEffect(() => {
        const getHotelAmenities = async () => {
            let hotelAmenitiesFromLocal: Amenity[] = JSON.parse(localStorage.getItem("hotelAmenities") || "[]");

            if (hotelAmenitiesFromLocal.length === 0) {
                const hotelAmenitiesFromServer = await getConstants("hotel_amenity");
                localStorage.setItem("hotelAmenities", JSON.stringify(hotelAmenitiesFromServer));
                hotelAmenitiesFromLocal = hotelAmenitiesFromServer;
            }
            setAmenityList(hotelAmenitiesFromLocal.map((amen) => {
                return {...amen, isChecked: tempHotelAmenities.some(obj => obj.code === amen.code)}
            }))
            // setAmenityList(hotelAmenitiesFromServer);
        }
        getHotelAmenities();
    }, [tempHotelAmenities])
    return (
        <>
            <div className="mt-6 mb-1 px-1 font-bold">Amenities</div>
            <div>
                {amenityList.map((amenity) => (
                    <HotelAmenityCard
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

export default HotelAmenityFilter
