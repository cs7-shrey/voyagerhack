import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
    sender: "user" | "bot";
    text: string
    mode?: "voice" | "text"
}
const Message: React.FC<Props> = ({sender, text}) => {
    return (
        <div 
            className={`
        max-w-[70%] px-2 py-3 
        ${sender === "user" ? "ml-auto" : "mr-auto"} 
        ${sender === "user" ? "bg-[#F6F6F6]" : "bg-white"}
        ${sender === "user" ? "rounded-lg" : "rounded-lg"}
        border-2 border-[#F6F6F6]
        text-left
        font-chat-message
        font-medium        
        `}
        >
            <ReactMarkdown children={text} remarkPlugins={[remarkGfm]} />
        </div>
    )
}

export default Message
