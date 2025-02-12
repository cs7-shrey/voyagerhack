// import RoomImage from "@/assets/RoomImage.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBed, /* faRulerCombined, */ faUser } from '@fortawesome/free-solid-svg-icons';
import RoomOffer from "./RoomOffer";
import { type RoomType } from "@/store/useHotelDescStore";
import RoomMoreInfo from "./RoomMoreInfo";
import { useState, useEffect } from "react";
import placeholderImg from "/placeholderImg.jpg"

type Props = RoomType

const RoomOption: React.FC<Props> = (roomType: RoomType) => {
    const [roomMoreInfo, setRoomMoreInfo] = useState(false)
    const handleClick = () => {
        setRoomMoreInfo((prev) => !prev)
    }
    useEffect(() => {
        if (roomMoreInfo) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [roomMoreInfo]);
    return (
        <div className="flex flex-col sm:flex-row w-11/12 mt-8 rounded-lg bg-primary/80" id="room-options">
            {/* Left Section - Image and Specifications */}
            <div className="flex flex-col sticky top-0 p-4 sm:max-w-[50%]  border border-r-2">
                <div className="ml-2 mt-2">
                    <b className="text-lg">{roomType.room_type_name}</b>
                </div>
                <div className="z-10">
                    <button onClick={handleClick} className="relative">
                        <img 
                            src={roomType.room_photos[0] ? roomType.room_photos[0] : placeholderImg} 
                            alt="room option photo" 
                            className="w-11/12 min-h-10 mx-auto mt-4 rounded-lg"
                        />
                        <div className="absolute bottom-1 left-4 py-2 px-2 text-left m-1 mr-auto w-fit h-fit max-w-[30%] max-h-[20%] text-xs md:text-sm bg-black/80 text-primary rounded-md">
          +{roomType.room_photos.length - 1}
                        </div>
                    </button>
                </div>
                <p className="w-11/12 mx-auto mt-4 px-4 py-2 rounded-lg text-center font-bold text-xs text-accent shadow-md">
          24/7 Room Service Available
                </p>
                <div className="flex flex-wrap gap-4 mx-4 my-4">
                    <p className="max-w-[50%] text-center text-sm">
                        <FontAwesomeIcon icon={faUser} className="text-gray-500" /> Max {roomType.max_guests} Guests
                    </p>
                    <p className="max-w-[50%] text-center text-sm">?
                        <FontAwesomeIcon icon={faBed} className="text-gray-500" /> {roomType.beds?.[0]?.type ? roomType.beds?.[0]?.type : "Bedroom 1-1 king bed / 2 twin beds"} {/* TODO: FIX THIS */}
                    </p>
                    {/* <p className="max-w-[50%] text-center text-sm">
            <FontAwesomeIcon icon={faRulerCombined} className="text-gray-500" /> 350 sqft coverage
          </p> */}
                </div>
            </div>

            {/* Right Section - Room Offers */}
            <div className="flex flex-col border border-primary rounded-r-lg border-l-0 h-[505px] pl-2 pt-2 overflow-y-auto scrollbar-webkit flex-2 max-w-full sm:w-[55%] md:w-[55%] self-center">
                {
                    roomType.rate_plans.map((rp, index) => (
                        <RoomOffer key={index} sNo={index+1} {...rp} roomTypeId={roomType.room_type_id} />
                    ))
                }
            </div>
            {
                roomMoreInfo && (
                    <RoomMoreInfo images={roomType.room_photos} onClose={handleClick} amenities={roomType.display_amenities}/>
                )
            }

        </div>
    )
}

export default RoomOption;