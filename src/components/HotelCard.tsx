import React, { useState } from 'react';
import { Star } from 'lucide-react';

export interface Hotel {
    id: number;
    name: string;
    location: string;
    price?: number;
    images?: string[];
    star_rating?: number;
    user_rating?: number;
    user_rating_count?: number;
}

const HotelCard: React.FC<Hotel> = ({
    name,
    location,
    price = 0,
    images = [],
    star_rating = 0,
    user_rating = 0,
    user_rating_count = 0
}) => {
    // State to track the currently displayed main image
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Calculate the number of remaining images for the "+X" overlay
    const remainingImages = images.length - 4;

    // Function to render the rating bubbles (similar to TripAdvisor style)
    const renderRatingBubbles = (rating: number) => {
        const fullBubbles = Math.floor(rating);
        const hasHalfBubble = rating % 1 >= 0.5;
        const totalBubbles = 5;

        return (
            <div className="flex gap-0.5">
                {Array.from({ length: totalBubbles }).map((_, index) => (
                    <div
                        key={index}
                        className={`w-2.5 h-2.5 rounded-full ${
                            index < fullBubbles
                                ? 'bg-green-500'
                                : index === fullBubbles && hasHalfBubble
                                ? 'bg-gradient-to-r from-green-500 to-white'
                                : 'bg-gray-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="flex rounded-lg overflow-hidden shadow-lg bg-white">
            {/* Left side - Main Image and Thumbnail Gallery */}
            <div className="w-72 relative flex flex-col">
                {/* Main Image */}
                <div className="h-48">
                    <img 
                        src={'https:' + images[selectedImageIndex] || "/api/placeholder/400/320"} 
                        alt={`${name} - View ${selectedImageIndex + 1}`}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Thumbnail Gallery */}
                <div className="flex bg-black/30 p-1 gap-1">
                    {images.slice(0, 5).map((img, index) => (
                        <div
                            key={index}
                            className="w-14 h-14 cursor-pointer relative"
                            onMouseEnter={() => setSelectedImageIndex(index)}
                        >
                            <img
                                src={'https:' + img}
                                alt={`${name} - Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            {/* Show remaining images count on the last visible thumbnail */}
                            {index === 4 && remainingImages > 0 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white/85 text-sm text-center">
                                    {/* +{remainingImages} */} VIEW ALL
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right side - Content */}
            <div className="flex-1 p-4 flex">
                {/* Hotel Information Section */}
                <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">{name}</h2>
                    
                    {/* Hotel Class (Star Rating) */}
                    <div className="flex items-center mb-2">
                        {[...Array(star_rating)].map((_, i) => (
                            <Star 
                                key={i} 
                                className="w-4 h-4 fill-[#E55842] text-[#E55842]" 
                            />
                        ))}
                    </div>

                    {/* User Rating Section */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-semibold">{user_rating}</span>
                        {renderRatingBubbles(user_rating)}
                        <span className="text-gray-600 text-xs">
                            {user_rating_count} reviews
                        </span>
                    </div>

                    {/* Location */}
                    <div className="text-gray-600">
                        {location}
                    </div>
                </div>

                {/* Vertical Divider */}
                <div className="w-px bg-gray-200 mx-4"></div>

                {/* Price Section */}
                {price && (
                    <div className="text-right">
                        <div className="text-2xl font-bold">
                            ₹{price.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                            a night
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HotelCard;