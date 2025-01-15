import { useSearchStore } from '@/store/useSearchStore';

interface Prop {
    text: string;
    isSelected: boolean;
}
const NumberBox: React.FC<Prop> = ({ text, isSelected }) => {
    const { setUserRating } = useSearchStore();
    const onClick = () => {
        console.log(Number(text.split("+")[0]));
        setUserRating(Number(text.split("+")[0]));
    }
    return (
        <button className='w-full' onClick={onClick}>
            <div className={`h-10 flex justify-center items-center rounded-md border-1 border-[#9ba8b0] ${isSelected ?  "bg-[#2c3439] text-primary" : "bg-primary text-secondary"}`}>
                {text}
            </div>
        </button>
    )
}

export default NumberBox
