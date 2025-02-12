import React from 'react'
import { Sender } from '@/lib/exploreChat';
import { BeatLoader } from 'react-spinners';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
    content: string;
    sender: Sender;
    isThinking: boolean;
}
const Message: React.FC<Props> = ({content, sender, isThinking}) => {
    return (
        <div className='flex flex-col'>
            <div className={`text-[0.9rem] text-gray-500 ${'text-left'}`}>
                {sender === Sender.USER ? 'you' : <span className="text-accentForeground">sage</span>}   
            </div> 
            <div className={`${'self-start'} ${isThinking ? '': '' } rounded-lg max-w-[80%]`}>
                {isThinking ? 
                    <div>
                        <p><BeatLoader size={8}/></p>
                    </div>    
                    :
                    <div 
                        className='font-manrope text-[#000000cf]'
                        style={{
                            letterSpacing: '0.5px',
                        }}
                    >
                        <ReactMarkdown children={content.toLowerCase()} remarkPlugins={[remarkGfm]} />
                    </div>
                }
            </div>
        </div>
    )
}

export default Message
