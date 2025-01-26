import AmenityNavbar from "@/pages/HotelDescription/components/AmenityNavbar";
import ImageBox from "@/components/refactor/ImageBox";
import Navbar from "@/pages/HotelDescription/components/Navbar"
import RoomOption from "@/components/refactor/RoomOption";
import { useEffect } from "react";
import { useHotelDescStore } from "@/store/useHotelDescStore";

// const RoomPackageMapper = () => {
//     const randomList = [1, 2, 3]
//     return (
//         <div className="room-wrapper">
//             <div className="wrapper-header">
//                 <div style={{ flex: "1.3", display: "flex", alignItems: "center", justifyContent: "center", height: "50px" }}>Room Details</div>
//                 <div style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", height: "50px" }}>Room Options</div>
//                 <div style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", height: "50px" }}>Price</div>
//             </div>
//             {randomList.map((_, i) => (<RoomPackage key={i} />))}
//         </div>
//     )
// }
interface Props {
    id: bigint
}

const HotelDescription: React.FC<Props> = ({ id }) => {
    const { hotelData, roomData } = useHotelDescStore();
    // console.log(roomData);

    useEffect(() => {
        const { getHotelData, getRoomData } = useHotelDescStore.getState();
        getHotelData(id);
        getRoomData(id);
    }, [id])
    return (
        <>
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
            <AmenityNavbar />
            <div className="grid grid-cols-10 bg-[#F0F0F0]">
                <div className="col-span-8 col-start-2">
                    <div className="room-wrapper">
                        <div className="wrapper-header">
                            <div style={{ flex: "1.3", display: "flex", alignItems: "center", justifyContent: "center", height: "50px" }}>Room Details</div>
                            <div style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", height: "50px" }}>Room Options</div>
                            <div style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", height: "50px" }}>Price</div>
                        </div>
                        {roomData?.map((_, i) => (
                            <RoomOption 
                                key={i}
                                {...roomData[i]}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
export default HotelDescription;