import React from 'react'

interface Props {
    sender: "user" | "bot";
    text: string
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
        {text}
    </div>
  )
}

export default Message
