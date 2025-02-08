import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router';
import placeholderImg from "/placeholderImg.jpg"
import { useHotelStore, type Hotel } from '@/store/useHotelStore';

const HotelCard: React.FC<Hotel> = ({
    id,
    name,
    location,
    base_fare = 0,
    images = [],
    hotel_star = 0,
    user_rating = 0,
    user_rating_count = 0,
}) => {
    // State to track the currently displayed main image
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const { selectedHotelId, setSelectedHotelId } = useHotelStore();    
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
        <div id={String(id)} 
            className={`flex rounded-lg w-full bg-white p-[0.2rem]
            ${selectedHotelId === id ? 'ring-2 ring-inset -ring-offset ring-accentForeground shadow-md' : 'shadow-md'}
            ${isHovered ? 'shadow-xl': ''} transition-shadow duration-300 ease-in-out 
            `}
            style={{
            }}
            onMouseEnter={() => {
                setIsHovered(true);
                setSelectedHotelId(id);
            }}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Left side - Main Image and Thumbnail Gallery */}
            <Link to={`/hotel/${id}`} className='w-full h-full flex overflow-hidden rounded-l-lg' target='_blank'>
                <div className="w-32 md:size-52 lg:size-52 relative flex flex-col rounded-l-lg">
                    {/* Main Image */}
                    <div className="h-48">
                        <img 
                            src={images[selectedImageIndex] ? 'https:' + images[selectedImageIndex] : placeholderImg} 
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
                                    src={img ? 'https:' + img :  placeholderImg}
                                    alt={`${name} - Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {/* Show remaining images count on the last visible thumbnail */}
                                {index === 4 && remainingImages > 0 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white/85 text-[8px] md:text-[12px] text-center">
                                        {/* +{remainingImages} */} VIEW ALL
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right side - Content */}
                <div className="flex-1 p-4 flex flex-col sm:flex-row">
                    {/* Hotel Information Section */}
                    <div className="flex-1">
                        <h2 className="text-md sm:text-xl font-semibold mb-2">{name}</h2>
                    
                        {/* Hotel Class (Star Rating) */}
                        <div className="flex items-center mb-2">
                            {[...Array(hotel_star)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    className="size-3 md:size-4 fill-[#E55842] text-[#E55842]" 
                                />
                            ))}
                        </div>

                        {/* User Rating Section */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
                            <div className='flex items-center gap-2'>
                                <div className="text-sm sm:text-md font-semibold">{user_rating}</div>
                                {renderRatingBubbles(user_rating)}
                            </div>
                            <div className="text-gray-600 text-xs">
                                {user_rating_count} reviews
                            </div>
                        </div>

                        {/* Location */}
                        <div className="text-gray-600 text-sm sm:text-md">
                            {location}
                        </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="w-px bg-gray-200 mx-4"></div>

                    {/* base_fare Section */}
                    {base_fare && (
                        <div className="">
                            <div className="text-lg sm:text-xl md:text-2xl w-fit ml-auto font-bold">
                            ₹{base_fare.toLocaleString()}
                            </div>
                            <div className="text-sm ml-auto w-fit text-gray-600">
                            a night
                            </div>
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
};

export default HotelCard;