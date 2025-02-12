import React from 'react'
import { type Event } from '@/store/useExplorePageStore'
import placeholderImg from '/placeholderImg.jpg' 


type Props = Event
const EventCard: React.FC<Props> = ({ name, description, infoURL, imageURL }) => {
    console.log(name, description, infoURL, imageURL)
    return (
        <div className='w-full max-w-[400px] h-full rounded-lg'>
            <div className='flex flex-col h-full relative'>
                <div className='h-60 w-80'>
                    <img 
                        src={imageURL ?? placeholderImg} 
                        alt="event image"
                        className='object-cover h-56 w-full rounded-t-lg'
                    />
                </div>
                <div className='flex flex-col mt-2 h-full'>
                    <div className='px-2'>
                        <h2 className='text-2xl font-roboto font-bold text-center'
                        >{name.slice(0,50)}</h2>
                    </div>
                    <div className='text-sm text-gray-500 px-2 pb-2 text-center'>
                        <p>{description.slice(0,220)}...</p>
                    </div>
                    <div className='mt-auto w-full bottom-0 text-center text-accent px-2 py-1 rounded-b-lg h-10 flex justify-center items-center border-t-1 [box-shadow:0px_-2px_10px_rgb(240,240,240)]'>
                        <a href={infoURL} target='_blank' className='font-[1rem] block w-full'>
                            More Info
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventCard
