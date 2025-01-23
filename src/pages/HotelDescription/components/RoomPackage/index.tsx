import "./room-package.css"
import RoomImage from "../../../../assets/RoomImage.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBed,faRulerCombined,faUser} from '@fortawesome/free-solid-svg-icons';
import RoomOffer from "./components/RoomOffer";
const RoomPackage=()=>{
    return (
        <div className="room-package">
            <div className="room-image-details">
                <div className="room-name">
                    <b>Deluxe Room</b>
                </div>
                <img src={RoomImage}/>
                <p className="banner">24/7 Room Service Available</p>
                <div className="specifications">
                    <p><FontAwesomeIcon icon={faUser} color="grey"/> &nbsp; Max 4 Guests</p>
                    <p><FontAwesomeIcon icon={faBed} color="grey"/> &nbsp; Bedroom 1-1 king bed / 2 twin beds</p>
                    <p><FontAwesomeIcon icon={faRulerCombined} color="grey"/> &nbsp;350 sqft coverage</p>
                </div>
            </div>
            <div className="room-details">
                <RoomOffer/>
                <RoomOffer/>
                <RoomOffer/>
            </div>
        </div>
    )
}
export default RoomPackage