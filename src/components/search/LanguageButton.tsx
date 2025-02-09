import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Language } from '@/lib/language'
import { useSocketStore } from '@/store/useSocketStore';

const LanguageButton = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { lang, setLang} = useSocketStore();
    return (
        <div className=''>
            <button 
                className='py-2 px-4 text-center flex flex-col justify-center items-center relative'
                onClick={() => setShowDropdown((prev) => !prev)}
            >
                <span className='text-lg'>{lang}</span>
                <ChevronDown size={16}/>
            </button>
            {showDropdown && <div className='absolute flex flex-col gap-1'>
                {Object.keys(Language).map((lang, index) => (
                    <button 
                        key={index}
                        className='bg-primary text-secondary rounded-md p-2 border-1'
                        onClick={() => {
                            setLang(Language[lang as keyof typeof Language])
                            setShowDropdown(false);
                        }}
                    >
                        {lang} ({Language[lang as keyof typeof Language]})
                    </button>
                ))}
            </div>}
        </div>
    )
}

export default LanguageButton
