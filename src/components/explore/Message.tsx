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
            <div className={`text-sm text-gray-500 ${'text-left'}`}>
                {sender === Sender.USER ? 'you' : 'sage'}   
            </div> 
            <div className={`${'self-start'} ${isThinking ? '': 'py-2' } rounded-lg max-w-[80%]`}>
                {isThinking ? 
                    <div>
                        <p><BeatLoader size={8}/></p>
                    </div>    
                    :
                    <div>
                        <ReactMarkdown children={content.toLowerCase()} remarkPlugins={[remarkGfm]} />
                    </div>
                }
            </div>
        </div>
    )
}

export default Message
