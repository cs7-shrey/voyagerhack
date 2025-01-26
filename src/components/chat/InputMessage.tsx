import { useState } from 'react'
import { Mic, Send } from 'lucide-react'
const InputMessage = () => {
  const [message, setMessage] = useState('');
  const [inputFocus, setInputFocus] = useState(false);
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  return (
    <div className={`py-2 pl-4 pr-2 rounded-full h-[3rem] sticky items-center flex border-2 justify-between ${inputFocus ? 'border-accentForeground' : 'border-[#F1F2F2]'}`}>
      <div className='flex'>
        <input 
          type="text" 
          className='focus:outline-none' 
          onChange={onInputChange} 
          placeholder='Type a message'
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
        />
      </div>
      <div className='flex gap-2'>
        {
          (message.length == 0)
          &&
          <button className='text-secondary/80'>
            <Mic size={20}/>
          </button>
        }
        <button>
          <div className={`rounded-full ${message.length == 0 ? 'bg-[#F1F2F2]' : 'bg-accentForeground'} pl-2 pr-[0.6rem] py-[0.55rem]`}>
            <Send size={18} color={`${message.length == 0 ? '#656D75' : 'white'}`}/>
          </div>
        </button>
      </div>
    </div>
  )
}

export default InputMessage
