
import Logo from './ui/Logo';
import SearchBar from './SearchBar';
  
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
            <button className='flex justify-center items-center bg-accentForeground/70 text-primary py-2 px-4 rounded-lg'>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
