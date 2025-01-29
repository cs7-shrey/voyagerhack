import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const rotateArrayRight = (arr: number[]) : number[] => {
    // let last = arr.pop() ? arr.pop() : 1;
    const last = arr[arr.length - 1]
    return [last, ...arr.slice(0, -1)];
}   

const Parser = ({text}: {text: string}) => {
    const chars = [...text];
    const start = 1;
    const end = 0.5;
    const [opacities, setOpacities] = useState([...chars.map((_, index) => {
        return end - (end - start) * (index) / (text.length - 1)
    })])
    useEffect(() => {
        const interval = setInterval(() => {
            setOpacities((prev) => rotateArrayRight(prev))
        }, 100)
        return () => clearInterval(interval);
    }, [])
    return chars.map((char, index) => {
        return (
            <span
                key={index}
                style={{
                    color: `rgba(255,255,255,${opacities[index]})`
                }}
            >
                {char}  
            </span>
        );
    });
}

const Shining = () => {
    const genToast = () => {
        toast("Here is your toast")
    }
    return (
        <div className=''>
            <Parser text='Searching...' />
            <button onClick={genToast} className="bg-blue-500 text-green-200 p-2 rounded-md">
                click me 
            </button>
        </div>
    )
}

export default Shining
