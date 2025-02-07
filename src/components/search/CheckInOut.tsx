import { formatDate } from "@/lib/utils"
import { useSearchStore } from "@/store/useSearchStore"

interface CheckProps {
    check: Date;
    setCheck: (data: Date) => void;
    label: string
}

const Check: React.FC<CheckProps> = ({check, setCheck, label}) => {
    return (
        <div className='flex flex-col border-r-2 h-full justify-end pr-2'>
            <div className="text-secondary/55 text-xs">
                {label}
            </div>
            <input
                type="date"
                className="pb-2 rounded-md text-accentForeground font-extrabold"
                value={formatDate(check)}
                onChange={(e) => setCheck(new Date(e.target.value))}
            />
        </div>
    )
}

const CheckInOut = () => {
    const { checkIn, setCheckIn, checkOut, setCheckOut} = useSearchStore()
    return (
        <>
            {/* checkin box */}
            <Check check={checkIn} setCheck={setCheckIn} label="Check-in" />
            {/* checkout box */}
            <Check check={checkOut} setCheck={setCheckOut} label="Check-out" />
        </>
    )
}

export default CheckInOut
