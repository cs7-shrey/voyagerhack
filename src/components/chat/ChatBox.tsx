import React from 'react'
import InputMessage from './InputMessage'
import Message from './Message'
import { X } from 'lucide-react'

interface Props {
    onClose: () => void
}
const ChatBox: React.FC<Props> = ({ onClose }) => {
    // some state logic
    return (
        <div className="sm:w-[80%] md:w-[30rem] sm:ml-auto m-4 border-4 flex flex-col gap-2 relative justify-end rounded-2xl bg-white h-[95%] px-4 pb-4">
            <div className='mb-auto sticky flex justify-between h-24'>
                <img src="/ai.gif" alt="." className='size-16 pt-2' />
                <button className='self-start ml-auto' onClick={onClose}>
                    <div className='pt-6'>
                        <X />
                    </div>
                </button>
            </div>
            <hr></hr>
            <div className='overflow-y-auto scrollbar-webkit flex flex-col gap-2 pr-1'>
                <Message text="this is a message that has gotten very long for now and there probably seems to be something wrong" sender="user" />
                <Message text="oh yeah, I'm the bot. The og chadGPT if you know." sender="bot" />
                <Message text="kehndi, hun neend ni aundi, pachtaundi to laake yaari jaata de munde hun khendi fir need ni aundi" sender="user" />
                <Message text="ohooo, mahol pura wavy" sender="bot" />
                <Message text="ohooo, mahol pura wavy" sender="bot" />
                <Message text="ohooo, mahol pura wavy" sender="bot" />
                <Message text="ohooo, mahol pura wavy" sender="bot" />
                <Message text="ohooo, mahol pura wavy" sender="bot" />
                <Message text="ohooo, mahol pura wavy" sender="bot" />
                <Message text="ohooo, mahol pura wavy" sender="bot" />
                <Message text="ohooo, mahol pura wavy" sender="bot" />
                <Message text="ohooo, mahol pura wavy" sender="bot" />
                <Message text="ohooo, mahol pura wavy" sender="bot" />
                <Message text="ohooo, mahol pura wavy" sender="bot" />
                <Message text="ohooo, mahol pura wavy" sender="bot" />
                <Message text="ohooo, mahol pura wavy" sender="bot" />
                <Message text="ohooo, mahol pura wavy" sender="bot" />

            </div>
            <InputMessage />
        </div>
    )
}

export default ChatBox
