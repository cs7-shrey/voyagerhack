import { useSearchStore } from "@/store/useSearchStore";
import { useNavigate } from "react-router";
import { formatDate } from "@/lib/utils";
import { Search } from "lucide-react";
import { useHotelStore } from "@/store/useHotelStore";


const SearchButton = () => {
    const { queryTerm, checkIn, checkOut } = useSearchStore();
    const { setInfoMessage } = useHotelStore();
    const navigate = useNavigate();
    return (
        <button
            className="flex h-full w-full justify-center items-center px-4 py-2 text-white bg-accentForeground"
            onClick={(e) => {
                e.preventDefault();
                setInfoMessage('')
                if (!queryTerm.place || !queryTerm.type) return;
                navigate(`/hotels?q=${encodeURIComponent(queryTerm.place)}&type=${queryTerm.type}&checkIn=${formatDate(checkIn)}&checkOut=${formatDate(checkOut)}`);
            }}
        >
            <Search size={20} className="mr-1 mb-[0.1rem]"/> 
            Search 
        </button>
    )
}

export default SearchButton
