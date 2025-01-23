import AmenityNavbar from "./components/AmenityNavbar";
import ImageBox from "./components/ImageBox";
import Navbar from "./components/Navbar"
import RoomPackage from "./components/RoomPackage";
import "./hotel-desc.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
const RoomPackageMapper=()=>{
    const randomList=[1,2,3]
    return (
        <div className="room-wrapper">
            <div className="wrapper-header">
                <div style={{flex:"1.3",display:"flex",alignItems:"center",justifyContent:"center",height:"50px"}}>Room Details</div>
                <div style={{flex:"1",display:"flex",alignItems:"center",justifyContent:"center",height:"50px"}}>Room Options</div>
                <div style={{flex:"1",display:"flex",alignItems:"center",justifyContent:"center",height:"50px"}}>Price</div>
            </div>
            {randomList.map((e)=>(<RoomPackage/>))}
        </div>
    )
}
const HotelDescription=()=>{
    return (
        <>
            <Navbar/>
            <ImageBox/>
            <AmenityNavbar/>
            <RoomPackageMapper/>
        </>
    )
}
export default HotelDescription;