import React, { useEffect, useRef } from 'react'
import InputMessage from './InputMessage'
import Message from './Message'
import { X } from 'lucide-react'
import { useHotelPageChatStore } from '@/store/useHotelPageChatStore'
import typing from '@/assets/typing.svg'
import { Circle } from 'lucide-react'

interface Props {
    onClose: () => void
}
const ChatBox: React.FC<Props> = ({ onClose }) => {
    // some state logic
    const { messages, waitingForMessage, textSocket, isTextSocketConnecting, connectTextSocket } = useHotelPageChatStore();
    const endRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        endRef?.current?.scrollIntoView({behavior: "smooth"})
    }, [messages])
    const widgetColor = textSocket?.readyState === WebSocket.OPEN ? 'rgb(108,161,72)' 
        : isTextSocketConnecting ? 'rgb(20,20,20)' 
            : (!textSocket || textSocket?.readyState === WebSocket.CLOSED) ? 'rgb(218,74,34)' : 'rgb(0,200,0)'
    const widgetText = textSocket?.readyState === WebSocket.OPEN ? 'connected' 
        : isTextSocketConnecting ? 'connecting' 
            : (!textSocket || textSocket?.readyState === WebSocket.CLOSED) ? 'disconnected' : 'error'
    const onClick = () => {
        connectTextSocket("12345658")
    }
    return (
        <div className="sm:w-[80%] md:w-[30rem] sm:ml-auto m-4 border-4 flex flex-col gap-2 relative rounded-2xl bg-white h-[95vh] px-4 pb-4">
            <div className='mb-auto sticky flex justify-between h-24 border-b-2'>
                <img src="/ai.gif" alt="." className='size-16 pt-2' />
                <div className='flex flex-col my-auto mx-auto items-center relative'>
                    <button 
                        disabled={textSocket?.readyState === WebSocket.OPEN || isTextSocketConnecting}
                        className='flex h-fit gap-2 px-4 py-1 border-2 rounded-full'
                        onClick={onClick}
                    >
                        <Circle size={6} 
                            fill={widgetColor}
                            color={widgetColor} 
                            className='self-center'
                        /> 
                        {widgetText}
                    </button>
                    {(!textSocket || textSocket?.readyState === WebSocket.CLOSED) && !isTextSocketConnecting && <div className='text-xs absolute top-10 text-secondary/70'>
                        click to connect
                    </div>}
                </div>
                <button className='self-start ml-auto' onClick={onClose}>
                    <div className='pt-6'>
                        <X />
                    </div>
                </button>
            </div>
            <div className='overflow-y-auto flex-1 z-50 max-h-fit scrollbar-webkit mt-auto flex flex-col gap-2 pr-1'>
                {messages.map((msg, index) => (
                    <Message key={index} text={msg.text} sender={msg.sender} />
                ))}
                <div ref={endRef} className='pl-2'>
                    {waitingForMessage && <img src={typing} className='h-10 w-14'/>}
                </div>
            </div>
            <InputMessage />
        </div>
    )
}

export default ChatBox
