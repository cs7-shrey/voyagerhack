import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';
import SearchDropdown from './SearchDropdown';
import { useSearchStore } from '@/store/useSearchStore';
import { formatDate } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';


const SearchBar = () => {
  const { queryTerm, checkIn, checkOut, setCheckIn, setCheckOut } = useSearchStore();
  const navigate = useNavigate();
  useEffect(() => {
    console.log("checkIn", checkIn);
  }, [checkIn]);
  return (
    <div>
      <div className="bg-accent rounded-md">
        <div className="flex flex-col md:flex-row gap-2 justify-start mt-4 items-start md:items-end p-4">
          <div className="flex flex-col md:flex-row justify-startmd:justify-center items-start md:items-end mx-2 mt-2 gap-2">
            <div className="flex flex-col">
              <div className='text-primary text-sm'>
                Where do you want to stay?
              </div>
              <SearchDropdown />
            </div>
            <div className='flex flex-col'>
              <div className="text-primary text-sm">
                Check-in Date
              </div>
              <input
                type="date"
                placeholder="Check-in Date"
                className="px-4 py-2 rounded-md"
                value={formatDate(checkIn)}
                onChange={(e) => setCheckIn(new Date(e.target.value))}
              />
            </div>
            <div className='flex flex-col'>
              <div className='text-primary text-sm'>
                Check-out Date
              </div>
              <input
                type="date"
                placeholder="Check-out Date"
                className="px-4 py-2 rounded-md"
                value={formatDate(checkOut)}
                onChange={(e) => setCheckOut(new Date(e.target.value))}
              />
            </div>
          </div>
          <div className='px-2'>
            <button
              className="flex px-4 py-2 rounded-md text-white bg-accentForeground"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/hotels?q=${encodeURIComponent(queryTerm.query)}&type=${queryTerm.type}`);
              }}
            >
              Search
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
