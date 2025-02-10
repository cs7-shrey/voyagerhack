import { useEffect, useState } from "react";
import {  Send } from "lucide-react";
import { useHotelPageChatStore } from "@/store/useHotelPageChatStore";
import { type Message } from "@/store/useHotelPageChatStore";
import { textChat } from "@/lib/chat";
import Voice from "./Voice";

const InputMessage = () => {
    const [userMessage, setUserMessage] = useState("");
    const [inputFocus, setInputFocus] = useState(false);
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserMessage(e.target.value);
    };
    const { connectTextSocket, setMessages, disconnectTextSocket, setTextSocket } = useHotelPageChatStore();

    useEffect(() => {
        const connect = async () => {
            console.log('connecting')
            /*const ws =*/ await connectTextSocket("948109283410") // change this later: TODO
        }
        const disconnect = async () => {
            await disconnectTextSocket()
        }
        connect()
        return () => {
            disconnect()
        }
    }, [connectTextSocket, disconnectTextSocket, setTextSocket])
    const onSendMessage = async () => {
        if (userMessage.trim().length == 0) return
        // const ws = await connectTextSocket("948109283410") // change this later: TODO
        const { textSocket: ws} = useHotelPageChatStore.getState()
        if (!ws) {
            return
        }
        const { messages: prevMessages } = useHotelPageChatStore.getState();
        const questionAnswer: Message[] = []
        setMessages([...prevMessages, {
            sender: "user",
            text: userMessage,
            mode: "text"
        }])
        questionAnswer.push({
            sender: "user",
            text: userMessage,
            mode: "text"
        })
        setUserMessage('')
        const llmMsg = await textChat(ws, userMessage)
        if (!llmMsg || llmMsg?.length === 0) {
            setMessages(prevMessages)
            return
        }
        questionAnswer.push({
            sender: "bot",
            text: llmMsg,
            mode: "text"
        })
        setMessages([...prevMessages, ...questionAnswer]);
    }

    return (
        <div className={`py-2 pl-4 pr-2 rounded-full h-[3rem] sticky items-center flex border-2 justify-between ${inputFocus ? 'border-accentForeground' : 'border-[#F1F2F2]'}`}>
            <div className='flex w-full'>
                <input 
                    type="text" 
                    className='focus:outline-none w-full' 
                    onChange={onInputChange} 
                    placeholder="Type a message"
                    onFocus={() => setInputFocus(true)}
                    onBlur={() => setInputFocus(false)}
                    value={userMessage}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSendMessage()
                        }
                    }}
                />
            </div>
            <div className='flex gap-2'>
                {
                    (userMessage.length == 0)
          &&
          <Voice />
                }
                <button>
                    <div className={`rounded-full ${userMessage.length == 0 ? 'bg-[#F1F2F2]' : 'bg-accentForeground'} pl-2 pr-[0.6rem] py-[0.55rem]`}>
                        <Send size={18} color={`${userMessage.length == 0 ? '#656D75' : 'white'}`}/>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default InputMessage;
