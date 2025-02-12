import placeholderImg from "/placeholderImg.jpg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faMap, faUser, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import HotelImagePopup from "./HotelImagesPopup";
import { Star } from "lucide-react";

interface Props {
  name: string | undefined;
  location: string | undefined;
  hotelStar: number | undefined;
  userRating: number | undefined;
  userRatingCount: number | undefined;
  images: string[] | undefined;
  firstRoomOptionName: string | undefined;
  firstRoomOptionPrice: number | undefined;
  firstRoomOptionTaxes: number | undefined;
  nRoomOptions: number | undefined;
}
const ImageBox: React.FC<Props> = ({ name, location, hotelStar, userRating, images, firstRoomOptionName, firstRoomOptionPrice, firstRoomOptionTaxes, nRoomOptions }) => {
    const [showPopup, setShowPopup] = useState(false);
    const handleClick = () => {
        setShowPopup((prev) => !prev);
    }
    useEffect(() => {
        if (showPopup) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    })
    return (
        <div className="flex flex-col w-full items-center shadow-md p-4">
            {/* Container for images and pricing */}
            <div className="flex flex-col md:flex-row flex-wrap w-full max-w-6xl gap-4">

                {/* Image & Hotel Info Section */}
                <div className="flex-auto md:flex-[2] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div>
                                <h2 className="text-xl font-bold">{name}</h2>
                            </div>
                            {/* Hotel Class (Star Rating) */}
                            <div className="flex items-center mb-2">
                                {[...Array(hotelStar)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="size-3 md:size-4 fill-[#E55842] text-[#E55842]"
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                <FontAwesomeIcon icon={faMap} className="mr-1" />
                                {location} |{" "}
                                <FontAwesomeIcon icon={faUtensils} className="mr-1" />
                Authentic Indian Cuisine
                            </p>
                        </div>
                        {/* <button className="shadow-sm rounded-md overflow-hidden flex">
              <div className="bg-blue-500 text-white px-2 py-1 flex items-center">
                <FontAwesomeIcon icon={faStar} className="mr-1 text-yellow-300" />
                {userRating}
              </div>
              <div className="px-2 py-1 text-gray-500 text-sm">User Reviews</div>
            </button> */}
                        {/* <div className="text-4xl font-[900]">
                {userRating}<span className="text-medium font-normal text-secondary/60">/5</span>
            </div> */}
                        <div className="p-2 text-primary bg-accent rounded-md">
                            {userRating}
                        </div>
                    </div>

                    {/* Main Images: Center + Side */}
                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="relative md:flex-1 min-w-[70%]" onClick={handleClick}>
                            <img
                                src={images?.[0] ? "https:" + images?.[0] : placeholderImg}
                                alt="Main"
                                className="w-full rounded-md shadow h-full min-h-[480x]"
                            />
                            <div className="absolute bottom-0 left-0 w-full flex justify-between bg-black/70 text-primary font-bold rounded-sm text-sm p-1">
                                <div>Property Photos</div>
                                <div>View all</div>
                            </div>
                        </div>
                        <div className="hidden md:flex-1 md:flex flex-col gap-2 mt-2 md:mt-0">
                            <img
                                src={images?.[0] ? "https:" + images?.[1] : placeholderImg}
                                alt="Side1"
                                className="w-full rounded-md shadow h-[50%]"
                            />
                            <img
                                src={images?.[0] ? "https:" + images?.[2] : placeholderImg}
                                alt="Side2"
                                className="w-full rounded-md shadow h-[50%]"
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing Details Section */}
                <div className="flex-auto md:flex-1 flex flex-col gap-4">
                    {/* Price Option */}
                    <div className="border border-gray-200 rounded-md shadow-sm p-4">
                        <div className="font-semibold mb-2 text-sm">{firstRoomOptionName}</div>
                        <div className="flex items-start mb-3">
                            <div className="flex-1 text-sm">
                                <FontAwesomeIcon icon={faUser} className="text-gray-500" /> 2 Guests |{" "}
                                <FontAwesomeIcon icon={faBed} className="text-gray-500" /> 1 Room
                                <p className="text-green-600 mt-1">Free Cancellation uptill 28th Jan</p>
                            </div>
                            <div className="flex-1 text-right">
                                <h2 className="text-xl font-bold">
                                    <span className="font-light">₹</span>{firstRoomOptionPrice}
                                </h2>
                                <p className="text-xs text-gray-500">
                  +₹{firstRoomOptionTaxes} taxes & fees<br />
                                    <span className="font-bold">1 Room</span> per night
                                </p>
                            </div>
                        </div>
                        <a href="#room-options">
                            <button
                                className="bg-accent text-primary hover:bg-accent/90 font-bold py-2 px-4 w-full rounded-md text-[0.8rem] md:text-sm lg:text-[0.9rem]" 
                            >
                VIEW {nRoomOptions} ROOM OPTIONS

                            </button>
                        </a>
                    </div>

                    {/* Special Amenities */}
                    {/* <div
            className="rounded-md p-4 bg-no-repeat bg-cover"
            style={{ backgroundImage: `url(${GoldBorder})` }}
          >
            <h2 className="text-lg font-bold text-yellow-700 mb-2">Special Amenities</h2>
            <ol className="list-disc list-inside text-sm">
              <li>Free In Room Refreshments</li>
              <li>5% Discount On Airport Transfer</li>
              <li>20% off on session of Spa</li>
              <li>Free Cancellation before 28 Jan 01:59 PM</li>
            </ol>
          </div> */}
                    {
                        showPopup
            &&
            <HotelImagePopup images={images ? images.map((img) => 'https:' + img) : []} onClose={handleClick} />
                    }
                </div>
            </div>
        </div>
    );
};

export default ImageBox;