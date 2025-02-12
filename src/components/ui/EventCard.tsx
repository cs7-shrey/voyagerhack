import React from 'react'
import { type Event } from '@/store/useExplorePageStore'
import placeholderImg from '/placeholderImg.jpg' 


type Props = Event
const EventCard: React.FC<Props> = ({ name, description, infoURL, imageURL }) => {
    console.log(name, description, infoURL, imageURL)
    return (
        <div className='w-full max-w-[400px] h-full rounded-lg'>
            <div className='flex flex-col h-full relative'>
                <div className='h-60 w-96'>
                    <img 
                        src={imageURL ?? placeholderImg} 
                        alt="event image"
                        className='object-cover h-full w-full rounded-t-lg'
                    />
                </div>
                <div className='flex flex-col mt-2 h-full'>
                    <div className='px-2'>
                        <h2 className='text-2xl font-roboto font-bold'
                        >{name}</h2>
                    </div>
                    <div className='text-sm text-gray-500 px-2 pb-2'>
                        <p>{description}</p>
                    </div>
                    <div className='mt-auto w-full bottom-0 bg-[#4835b4] text-center text-primary px-2 py-1 rounded-b-lg'>
                        <a href={infoURL} target='_blank' className='font-[1rem] block w-full'>
                            more info
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventCard
