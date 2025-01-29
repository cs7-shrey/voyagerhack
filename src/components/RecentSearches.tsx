import { Plane, Bed, Car, Palmtree } from 'lucide-react';
import { Card } from '@/components/ui/card';

const RecentSearches = () => {
  return (
    <div className="p-6 font-sans flex flex-col">
      <h1 className="text-2xl font-bold mb-6 text-[#05203C]">Your recent searches</h1>
      
      <div className="flex gap-4 flex-col sm:flex-row">
        {/* Recent Search Card */}
        <Card className="p-6 bg-white rounded-xl shadow-sm w-72">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gray-900 rounded-full p-2">
              <Bed className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-[#05203C]">New Delhi, National Capital Territory of India, India</p>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <span>Sat 18/1</span>
              <span>›</span>
              <span>Sun 19/1</span>
            </div>
            <p className="text-gray-600">2 guests, 1 room</p>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold text-[#05203C]">₹ 470</span>
            <button className="bg-red-500 p-2 rounded-lg hover:bg-red-600 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </Card>

        {/* New Search Card */}
        <Card className="p-6 bg-white rounded-xl shadow-sm w-72 flex flex-col items-center justify-center">
          <div className="mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6">Start a new search</p>
          
          <div className="flex gap-3">
            <button className="bg-red-500 p-3 rounded-lg hover:bg-red-600 transition-colors">
              <Plane className="w-5 h-5 text-white" />
            </button>
            <button className="bg-red-500 p-3 rounded-lg hover:bg-red-600 transition-colors">
              <Bed className="w-5 h-5 text-white" />
            </button>
            <button className="bg-red-500 p-3 rounded-lg hover:bg-red-600 transition-colors">
              <Car className="w-5 h-5 text-white" />
            </button>
            <button className="bg-red-500 p-3 rounded-lg hover:bg-red-600 transition-colors">
              <Palmtree className="w-5 h-5 text-white" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecentSearches;