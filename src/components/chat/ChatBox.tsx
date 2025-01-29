import React, { useEffect, useRef } from 'react'
import InputMessage from './InputMessage'
import Message from './Message'
import { X } from 'lucide-react'
import { useHotelPageChatStore } from '@/store/useHotelPageChatStore'
import typing from '@/assets/typing.svg'

interface Props {
    onClose: () => void
}
const ChatBox: React.FC<Props> = ({ onClose }) => {
    // some state logic
    const { messages, waitingForMessage } = useHotelPageChatStore();
    const endRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        endRef?.current?.scrollIntoView({behavior: "smooth"})
    })

    return (
        <div className="sm:w-[80%] md:w-[30rem] overflow-auto sm:ml-auto m-4 border-4 flex flex-col gap-2 relative justify-end rounded-2xl bg-white h-[95%] px-4 pb-4">
            <div className='mb-auto sticky flex justify-between h-24 border-b-2'>
                <img src="/ai.gif" alt="." className='size-16 pt-2' />
                <button className='self-start ml-auto' onClick={onClose}>
                    <div className='pt-6'>
                        <X />
                    </div>
                </button>
            </div>
            <div className='overflow-y-auto h-full scrollbar-webkit flex flex-col gap-2 pr-1'>
                {messages.map((msg, index) => (
                    <Message key={index} text={msg.text} sender={msg.sender} />
                ))}
                <div ref={endRef} className='pl-2 mt-auto'>
                    {waitingForMessage && <img src={typing} className='h-10 w-14'/>}
                </div>
            </div>
            <InputMessage />
        </div>
    )
}

export default ChatBox
