
import Logo from './ui/Logo';
import SearchBar from './SearchBar';
  
const TopBar = () => {
  return (
    <div>
      <div className="rounded-md bg-accent sticky z-40">
        <div className="flex flex-row sm:flex-row gap-2 bg-whitee justify-between items-start sm:items-center md:items-center py-4">
          <Logo />
          <SearchBar />
          <div className='flex'>
            <button className='flex justify-center items-center bg-accentForeground text-primary p-2 rounded-lg'>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
