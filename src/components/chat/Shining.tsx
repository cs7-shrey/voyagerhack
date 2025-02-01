import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
    const colors = [200, 300, 400, 500, 600, 700, 800]
    const [grad, setGrad] = useState(colors.length - 1);
    const [start, setStart] = useState(6)
    useEffect(() => {
        const interval = setInterval(() => {
            setGrad((prev) => (prev + 1) % colors.length);
            setStart((prev) => (prev + 1) % colors.length);
        }, 1000)
        return () => {
            clearInterval(interval)
        }
    }, [colors.length])
    return (
        <div className='w-full'>
            <Parser text='Searching...' />
            <button onClick={genToast} className="bg-blue-500 text-green-200 p-2 rounded-md">
                click me 
            </button>
            <div className={`bg-gradient-to-b from-blue-${colors[start]} to-blue-${colors[grad]} h-[70vh]`}>
                    alsdkfj;alskfja
            </div>
        </div>
    )
}

export default Shining
