import React, { useEffect, useState } from 'react';
import { useSearchStore } from '@/store/useSearchStore';
import AmenityCard from './ui/AmenityCard';

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
        const { hotelAmenities, setHotelAmenities } = useSearchStore.getState();
        if (isChecked) {
            setHotelAmenities([...hotelAmenities, { name: text, code }]);
        } else {
            setHotelAmenities(hotelAmenities.filter((amenity) => amenity.code !== code));
        }
    }, [isChecked, code, text]);
    return (
        <AmenityCard text={text} isChecked={isChecked} handleClick={onClick} />
        // <div
        //     className="flex items-center gap-3 hover:bg-gray-50 rounded-lg py-4 px-2 cursor-pointer select-none"
        //     onClick={() => setIsChecked(!isChecked)}
        // >
        //     <div className={`w-5 h-5 border rounded flex items-center justify-center bg-white
        // ${isChecked ? 'border-gray-400' : 'border-gray-300'}`}>
        //         {isChecked && (
        //             <svg
        //                 className="w-3 h-3 text-black"
        //                 viewBox="0 0 20 20"
        //                 fill="currentColor"
        //             >
        //                 <path
        //                     fillRule="evenodd"
        //                     d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        //                     clipRule="evenodd"
        //                 />
        //             </svg>
        //         )}
        //     </div>
        //     <span className="text-gray-700">{text}</span>
        // </div>
    );
};

export default HotelAmenityCard;