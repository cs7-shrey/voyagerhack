import { useState } from "react";
import { Mic, Send } from "lucide-react";
import { useHotelPageChatStore } from "@/store/useHotelPageChatStore";
import { type Message } from "@/store/useHotelPageChatStore";

const InputMessage = () => {
  const [userMessage, setUserMessage] = useState("");
  const [inputFocus, setInputFocus] = useState(false);
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  };
  const { connectTextSocket, setMessages } = useHotelPageChatStore();

  const sendAndWait = async (questionAnswer: Message[]) => {
    if (userMessage.length == 0) return
    const ws = await connectTextSocket(BigInt("948109283410")) // change this later: TODO
    if (ws) {
      const success = await new Promise((resolve, reject) => {
        ws.onmessage = (serverMessage) => {
          console.log(serverMessage)
          questionAnswer.push({sender: "bot", text: serverMessage.data, "mode": "text"})
          resolve(true)
        }
        ws.send(userMessage)
        ws.onerror = () => {
          reject(false)
        }
        ws.onclose = () => {
          console.log('text chat ws closed')
          reject(false)
        }
      })
      return success
    }
  }
  const onSendMessage = async () => {
    const { messages: prevMessages } = useHotelPageChatStore.getState()
    const questionAnswer: Message[] = []
    setUserMessage('')
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
    const success = await sendAndWait(questionAnswer)
    if (!success) {
      setMessages(prevMessages)
      return
    }
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
          <button className='text-secondary/80'>
            <Mic size={20}/>
          </button>
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
