import React from 'react'
import ImageNavigator from '../ImageNavigator';
import { X } from 'lucide-react';

interface Props {
    images: string[];
    onClose?: () => void;
}
const HotelImagePopup: React.FC<Props> = ({images, onClose}) => {
  return (
    <div className='fixed z-50 w-full h-full flex justify-center items-center inset-0 bg-transparent/50'>
        <div className='w-[90%] md:w-[70%]fo lg:w-[50%] h-[60%] rounded-md bg-white'>
            <div className='flex justify-end'>
                <button className='p-4' onClick={onClose}>
                    <X size={24} />
                </button>
            </div>
            <div className='p-4 mt-12'>
                <ImageNavigator images={images} />
            </div>
        </div>
    </div>
  )
}

export default HotelImagePopup;
