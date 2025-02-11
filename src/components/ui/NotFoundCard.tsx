import NotFound from '@/assets/NotFound.svg'
import React from 'react'

const NotFoundCard: React.FC<{
    text: string
}> = ({text}) => {
    return (
        <div className='flex flex-col items-center font-bold gap-2'>
            <img 
                src={NotFound} 
                alt="Not Found" 
                className='size-[50%]'
            />
            <div className='text-xl text-center font-mono'>
                {text}
            </div>
        </div>
    )
}

export default NotFoundCard
