import React from 'react'
import placeholderImg from '/placeholderImg.jpg' 
import { type Place } from '@/store/useExplorePageStore';

type Props = Place
const PlaceCard: React.FC<Props> = ({name, address, imageURL, googleMapsLink}) => {
    return (
        <div className='w-full max-w-[300px] h-full'>
            <div className='flex flex-col h-full'>
                <div className='w-64 h-64'>
                    <img 
                        src={imageURL ?? placeholderImg} 
                        alt="place image"
                        className='object-cover h-full w-full rounded-lg'
                    />     
                </div> 
                <div className='flex flex-col mt-2 h-full'>
                    <div>
                        <h2 className='text-lg font-bold'>{name}</h2>
                    </div>
                    <div className='text-sm text-gray-500'>
                        <p>{address}</p>
                    </div>
                    <div className='mt-auto w-[30%] bottom-0 bg-accent text-center text-primary px-2 py-1 rounded-md'>
                        <a href={googleMapsLink} target='_blank' className='font-[1rem]'>
                            visit
                        </a>
                    </div>
                </div>
            </div> 
        </div>
    )
}


export default PlaceCard
