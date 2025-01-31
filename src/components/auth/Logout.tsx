import { User } from "lucide-react"
import { logout } from "@/store/useAuthStore"

const Logout = () => {
    return (
        <button
            onClick={() => logout()}
            className='flex gap-2 justify-center items-center font-bold hover:bg-gray-500 text-primary py-2 px-4 rounded-lg'
        >
            <User />
            Log out
        </button>
    )
}

export default Logout
