
import Logo from './ui/Logo';
import SearchBar from './SearchBar';
import { User } from 'lucide-react';
import { logout } from '@/store/useAuthStore';  
const TopBar = () => {
  return (
    <div>
      <div className="rounded-md bg-accent relative sm:sticky sm:z-40">
        <div className="flex flex-row sm:flex-row gap-2 justify-center md:justify-center lg:justify-between  items-start sm:items-center md:items-center py-4">
          <div className='lg:block hidden'>
            <Logo />
          </div>
          <SearchBar />
          <div className='lg:flex hidden'>
            <button 
              onClick={() => logout()}
              className='flex gap-2 justify-center items-center font-bold hover:bg-gray-500 text-primary py-2 px-4 rounded-lg'
            >
              <User/>
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
