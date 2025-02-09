import { useEffect, useState } from 'react';
import { MapPin, Building2, Plane, Hotel, Building } from 'lucide-react';
import { axiosInstance } from '../lib/axiosConfig';
import { useSearchStore } from '@/store/useSearchStore';

interface SearchSuggestion {
    label: string;
    subLabel: string;
    type: 'hotel' | 'location' | 'city' | 'country' | 'airport';
}
const placeTypeToIcon = {
    hotel: Hotel,
    location: Building,
    city: MapPin,
    country: Building2,
    airport: Plane,
}

const SearchDropdown= () => {
    const { searchValue, setSearchValue, setQueryTerm } = useSearchStore();
    const [showDropdown, setShowDropdown] = useState(false);
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    useEffect(() => {
        const getSuggestions = async () => {
            try {
                const response = await axiosInstance.get('/search/suggestions', {
                    params: {
                        search_term: searchValue,
                    },
                });
                if (response.status !== 200) {
                    new Error('Failed to fetch suggestions');
                }
                setSuggestions(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        getSuggestions();
    }, [searchValue]);


    return (
        <div className="relative w-full">
            <input
                type="text"
                value={searchValue}
                onChange={(e) => {
                    setSearchValue(e.target.value);
                    setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Enter hotel or destination"
                className="w-full pr-4 rounded-md focus:outline-none selection:border-none selection:outline-none"
            />
      
            {showDropdown && searchValue && (
                <div className="absolute w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                    {suggestions.map((suggestion, index) => {
                        const Icon = placeTypeToIcon[suggestion.type];
                        return (
                            <div
                                key={index}
                                className="flex items-start p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                onClick={() => {
                                    setSearchValue(suggestion.label);
                                    setQueryTerm({ place: suggestion.label, type: suggestion.type });
                                    setShowDropdown(false);
                                }}
                            >
                                <div className="flex-shrink-0 mt-1">
                                    <Icon className="w-4 h-4 text-gray-500" />
                                </div>
                                <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">{suggestion.label}</div>
                                    <div className="text-xs text-gray-500">{suggestion.subLabel}</div>
                                </div>
                                <div className="ml-auto text-xs text-gray-400 mt-1">
                                    {suggestion.type}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SearchDropdown;