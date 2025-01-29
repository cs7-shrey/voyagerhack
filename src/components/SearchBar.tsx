// import { useNavigate } from 'react-router';
import SearchDropdown from './SearchDropdown';
// import { useSearchStore } from '@/store/useSearchStore';
// import { formatDate } from '@/lib/utils';
// import { ArrowRight } from 'lucide-react';
import SearchButton from './search/SearchButton';
import CheckInOut from './search/CheckInOut';
import Voice from '@/routes/Voice';
import LanguageButton from './search/LanguageButton';


const SearchBar = () => {
  // const { queryTerm, checkIn, checkOut, setCheckIn, setCheckOut } = useSearchStore();
  // const navigate = useNavigate();
  return (
    // <div>
    //   <div className="rounded-md bg-accent">
    //     <div className="flex flex-col sm:flex-row gap-2 justify-start mt-4 items-start sm:items-center md:items-center p-4">
    //       <div className='min-h-full'>
    //         < Voice />
    //       </div>
    //       <div>
    //         <div className="flex flex-row md:flex-row justify-startmd:justify-center items-start md:items-end mx-2 mt-2 gap-2">
    //           <div className="flex flex-col">
    //             <div className='text-primary text-sm'>
    //               Where do you want to stay?
    //             </div>
    //             <SearchDropdown />
    //           </div>
    //         </div>
    //         <div className='flex sm:items-start md:items-end flex-col md:flex-row '>
    //           <div className='flex gap-2 m-2 flex-col items-start sm:flex-row sm:items-end' id='checkInCheckOut'>
    //             {/* checkin box */}
    //             <div className='flex flex-col'>
    //               <div className="text-primary text-sm">
    //                 Check-in Date
    //               </div>
    //               <input
    //                 type="date"
    //                 placeholder="Check-in Date"
    //                 className="px-4 py-2 rounded-md"
    //                 value={formatDate(checkIn)}
    //                 onChange={(e) => setCheckIn(new Date(e.target.value))}
    //               />
    //             </div>
    //             {/* checkout box */}
    //             <div className='flex flex-col'>
    //               <div className='text-primary text-sm'>
    //                 Check-out Date
    //               </div>
    //               <input
    //                 type="date"
    //                 placeholder="Check-out Date"
    //                 className="px-4 py-2 rounded-md"
    //                 value={formatDate(checkOut)}
    //                 onChange={(e) => setCheckOut(new Date(e.target.value))}
    //               />
    //             </div>
    //           </div>
    //           <div className='px-2 m-2'>
    //             <button
    //               className="flex px-4 py-2 rounded-md text-white bg-accentForeground"
    //               onClick={(e) => {
    //                 e.preventDefault();
    //                 if (!queryTerm.place || !queryTerm.type) return;
    //                 navigate(`/hotels?q=${encodeURIComponent(queryTerm.place)}&type=${queryTerm.type}&checkIn=${formatDate(checkIn)}&checkOut=${formatDate(checkOut)}`);
    //               }}
    //             >
    //               Search
    //               <ArrowRight />
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <>
      <div className='flex flex-col md:flex-row bg-white rounded-md'>
        {/* voice controls */}
        <div className='flex self-center md:self-start border-l-2 rounded-md md:rounded-none md:border-0'>
          <div className='min-h-full border-r-2'>
            <Voice />
          </div>
          <div className='border-r-2 flex justify-center items-center'>
            <LanguageButton />
          </div>
        </div>
        <div className='flex flex-col sm:flex-row items-end border-t-4 md:border-none'>   {/* height ok */}
          {/* search input and dropdown */}
          <div className="flex flex-col w-full sm:w-auto px-2 justify-center my-auto lg:mt-auto py-3">
            <div className='text-secondary/55 text-xs'>
              Where do you want to stay?
            </div>
            <SearchDropdown />
          </div>
          {/* checkin-checkout-search-button */}
          <div className='flex sm:items-start md:items-end flex-col md:flex-row h-full border-t-2 border-l-0 sm:border-l-4 md:border-l-2 md:border-t-0'>
            <div className='flex gap-2 sm:flex-row h-full pl-1' id='checkInCheckOut'>
              <CheckInOut />
            </div>
            <div className='w-full h-full md:rounded-r-md'>
              <SearchButton />
            </div>
            {/* <div className="text-white flex font-bold gap-1">
                      Microphone
                    <MicOff color="#3B5100"/>
                  </div> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchBar
