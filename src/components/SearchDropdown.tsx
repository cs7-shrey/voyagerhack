import { useState } from 'react';
import { MapPin, Building2, Plane, Hotel, Building } from 'lucide-react';

// Add this component inside your App.tsx
const SearchDropdown = () => {
  const [searchValue, setSearchValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Sample data - in a real app, this would come from an API
  const suggestions = [
    { type: 'region', icon: MapPin, label: 'Delhi', subLabel: 'India' },
    { type: 'city', icon: Building2, label: 'New Delhi', subLabel: 'Delhi, India' },
    { type: 'airport', icon: Plane, label: 'Indira Gandhi International (DEL)', subLabel: 'New Delhi, Delhi, India' },
    { type: 'hotel', icon: Hotel, label: 'Della Resorts', subLabel: 'Lonavala, Pune District, Maharashtra, India' },
    { type: 'district', icon: Building, label: 'Aerocity', subLabel: 'New Delhi, Delhi, India' },
    { type: 'district', icon: Building, label: 'Connaught Place', subLabel: 'New Delhi, Delhi, India' },
    { type: 'country', icon: MapPin, label: 'India', subLabel: 'Country' },
  ];

//   const filteredSuggestions = suggestions.filter(suggestion =>
//     suggestion.label.toLowerCase().includes(searchValue.toLowerCase()) 
//     ||
//     suggestion.subLabel.toLowerCase().includes(searchValue.toLowerCase())
//   );
  const suggestionsInLabel = suggestions.filter(suggestion =>
    suggestion.label.toLowerCase().includes(searchValue.toLowerCase())
  );
    const suggestionsInSubLabel = suggestions.filter(suggestion =>
        suggestion.subLabel.toLowerCase().includes(searchValue.toLowerCase())
    );
    const filteredSuggestions = Array.from(new Map([...suggestionsInLabel, ...suggestionsInSubLabel].map(item => [item.label, item])).values());
    console.log(filteredSuggestions);
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
        placeholder="Where do you want to stay?"
        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
      />
      
      {showDropdown && searchValue && (
        <div className="absolute w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {filteredSuggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <div
                key={index}
                className="flex items-start p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => {
                  setSearchValue(suggestion.label);
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