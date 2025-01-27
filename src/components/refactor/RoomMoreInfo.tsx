import React from 'react'
import ImageNavigator from '../ImageNavigator';
import { X } from 'lucide-react';

interface Props {
    images: string[];
    onClose?: () => void;
    amenities: string[];
}
const RoomMoreInfo: React.FC<Props> = ({images, onClose, amenities}) => {
  return (
    <div className='fixed z-50 w-full h-full flex justify-center items-center inset-0 bg-transparent/20'>
        <div className='col-span-4 col-start-4 w-[80%] sm:w-[70%] md:w-[50%] lg:w-[40%] h-[90%] bg-white'>
            <div className='flex justify-end'>
                <button className='p-4' onClick={onClose}>
                    <X size={24} />
                </button>
            </div>
            <div className='p-4'>
                <ImageNavigator images={images} />
            </div>
            <div className='p-4'>
                <h1 className='font-bold'>Amenities</h1>
                <ul className='text-black/60 text-sm'>
                    {amenities.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  )
}

export default RoomMoreInfo;
