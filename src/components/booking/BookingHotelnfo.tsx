import React from 'react'
import { Star } from 'lucide-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from '@fortawesome/free-solid-svg-icons';
interface Props {
    imageURL: string;
    name: string;
    hotelStars: number;
    address: string;
    userRating: number;
    userRatingCount: number;

}
const BookingHotelInfo: React.FC<Props> = ({ imageURL, name, hotelStars, address, userRating, userRatingCount }) => {
    return (
        <div className='w-full flex gap-2'>
            <div className='w-1/3'>
                <img src={imageURL} alt='hotel image' className='rounded-lg'/>
            </div>
            <div className='flex flex-col'>
                <h1 className='text-lg font-bold'>
                    {name}
                </h1>
                <div className='flex'>
                    {[...Array(hotelStars)].map((_, i) => (
                        <Star
                            key={i}
                            className="size-3 md:size-4 fill-[#E55842] text-[#E55842]"
                        />
                    ))}
                </div>
                <div className='mt-2 flex text-gray-500'>
                    <FontAwesomeIcon icon={faMap} className="mr-1" />
                    <p className='text-sm'>
                        {address}
                    </p>
                </div>
                <div className='flex mt-1 text-sm gap-1 text-gray-500'>
                    <div className=''>
                        {userRating}/5
                    </div>
                    <div>
                        {userRatingCount} ratings
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingHotelInfo
