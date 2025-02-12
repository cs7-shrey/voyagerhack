import React from 'react'
import placeholderImg from '/placeholderImg.jpg' 
import { type Place } from '@/store/useExplorePageStore';

type Props = Place
const PlaceCard: React.FC<Props> = ({name, address, imageURL, googleMapsLink}) => {
    return (
        <div className='w-full max-w-[300px] h-[440px]'>
            <div className='flex justify-between items-center flex-col w-full h-[420px]'>
                <div className='w-64 h-56'>
                    <img 
                        src={imageURL ?? placeholderImg} 
                        alt="place image"
                        className='object-cover min-h-56 max-h-56 w-full rounded-lg'
                    />     
                </div> 
                <div className='flex flex-col mt-2 justify-between items-center min-h-min h-36'>
                    <div>
                        <h2 className='text-lg font-bold [text-shadow:2px_2px_5px_lightgrey] text-center'>{name}</h2>
                    </div>
                    <div className='text-sm text-gray-500 p-2 rounded text-center'>
                        <p>{address}</p>
                    </div>
                    <div className='mt-2 w-[70%] h-10 bg-accent text-center text-white px-2 py-1 rounded-md flex items-center justify-center'>
                        <a href={googleMapsLink} target='_blank' className='font-[1rem] font-extralight tracking-wide'>
                            VISIT
                        </a>
                    </div>
                </div>
            </div> 
        </div>
    )
}


export default PlaceCard
