import ImageBox from "@/components/refactor/ImageBox";
import Navbar from "@/pages/HotelDescription/components/Navbar"
import RoomOption from "@/components/refactor/RoomOption";
import { useState, useEffect } from "react";
import { useHotelDescStore } from "@/store/useHotelDescStore";
import HotelNavbar from "@/components/refactor/HotelNavbar";
import { Bot } from "lucide-react";
import ChatBox from "@/components/chat/ChatBox";
import { useNavigate, useParams } from "react-router";

const HotelDescription = () => {
    const { hotelData, roomData } = useHotelDescStore();
    const [chatBoxOpen, setChatBoxOpen] = useState(false);
    const onClick = () => {
        setChatBoxOpen((prev) => !prev);
    }
    let { id } = useParams()
    const navigate = useNavigate()
    if (!id) {
        id = "124123412341234123"
        navigate('/')
    }
    useEffect(() => {
        return () => {
            const { setHotelData, setRoomData } = useHotelDescStore.getState();
            setHotelData(null);
            setRoomData(null)
        }
    }, [])

    useEffect(() => {
        const { getHotelData, getRoomData } = useHotelDescStore.getState();
        getHotelData(id);
        getRoomData(id);
    }, [id])
    return (
        <div className="relative">
            <Navbar />
            <ImageBox
                name={hotelData?.name}
                location={hotelData?.location}
                hotelStar={hotelData?.hotelStar}
                userRating={hotelData?.userRating}
                userRatingCount={hotelData?.userRatingCount}
                images={hotelData?.images}
                firstRoomOptionName={roomData?.[0].room_type_name}
                firstRoomOptionPrice={roomData?.[0].rate_plans?.[0].base_fare}
                firstRoomOptionTaxes={roomData?.[0].rate_plans?.[0].taxes}
                nRoomOptions={roomData?.length}
            />  
            <HotelNavbar />
            <div className="flex flex-col justify-center items-center md:grid md:grid-cols-10 overflow-y-auto top-0 bg-[#d6d6d696]">
                <div className="col-span-8 col-start-2 mx-auto">
                    <div className="room-wrapper flex flex-col items-center">
                        {/* <div className="wrapper-header">
                            <div style={{ flex: "1.3", display: "flex", alignItems: "center", justifyContent: "center", height: "50px" }}>Room Details</div>
                            <div style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", height: "50px" }}>Room Options</div>
                            <div style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", height: "50px" }}>Price</div>
                        </div> */}
                        {roomData?.map((_, i) => (
                            <RoomOption 
                                key={i}
                                {...roomData[i]}
                            />
                        ))}
                    </div>
                </div>
            </div>
            {!chatBoxOpen && 
            <div className="fixed z-50 bottom-2 right-2 rounded-lg size-16 flex justify-center items-center bg-accent">
                <button className="w-full h-full p-4" onClick={onClick}>
                    <Bot color="white" size={28}/>
                </button>
            </div>}
            {
                chatBoxOpen &&
                <div className="fixed bottom-2 right-2 inset-0 z-50 h-full w-full bg-transparent/30">
                    <ChatBox onClose={onClick}/>
                </div>
            }
        </div>
    )
}
export default HotelDescription;