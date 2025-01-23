import "./image-box.css"
import "./feature-list.css"
import Image1 from "../../../../assets/Side1.png"
import Image2 from "../../../../assets/Side2.png"
import Image3 from "../../../../assets/Center1.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed,faMap,faStar,faUser, faUtensils } from '@fortawesome/free-solid-svg-icons';
import GoldBorder from "../../../../assets/GoldBorder.png"
const ImageBox=()=>{
    return (
        <div className="to-center">
            <div className="hotel-star">
                <p> 4 <FontAwesomeIcon icon={faStar} color="gold"/> hotel</p>
            </div>
            <div className="hotel-view">
                <div className="image-box">
                    <div className="header">
                        <div className="hotel-name">
                            <h2>
                                Radisson Blu Plaza
                            </h2>
                            <p><FontAwesomeIcon icon={faMap}/> &nbsp;Gurugram, Haryana |&nbsp; <FontAwesomeIcon icon={faUtensils}/> &nbsp;Authententic Indian Cuisine</p>
                        </div>
                        <div className="hotel-location">
                            <button className="user-review">
                                <div className="icon"><FontAwesomeIcon icon={faStar} color="gold"/>4.5 &nbsp;</div>
                                <div className="supp-text"> User Reviews</div>
                            </button>
                        </div>
                    </div>
                    <div className="main-box">
                        <div className="center-image">
                            <img src={Image3}/>
                        </div>
                        <div className="side-image">
                            <img src={Image1}/>
                            <img src={Image2}/>
                        </div>
                    </div>
                </div>
                <div className="pricing-details">
                    <div className="price-option">
                        <div className="room-type">
                            <b>Deluxe room</b>
                        </div>
                        <div className="room-details">
                            <div className="room-cancellation">
                                <FontAwesomeIcon icon={faUser} color="grey"/> 2 Guests | <FontAwesomeIcon icon={faBed} color="grey"/> 1 Room
                                <p>Free Cancellation uptill 28th Jan</p>
                            </div>
                            <div className="room-price">
                                <h2>
                                <span style={{fontWeight:"300"}}>₹</span>9,304
                                </h2>
                                <p>+₹2,334 taxes & fees<br/>
                                <span>1 Room</span> per night
                                </p>
                            </div>
                        </div>
                        <button className="downlink">
                            VIEW 7 ROOM OPTIONS
                        </button>
                    </div>
                    <div className="glowing-border" style={{backgroundImage:`url(${GoldBorder})`}}>
                        <h2 className="gold-lustrous-text">Special Amenities</h2>
                        <ol>
                            <li>Free In Room Refreshments</li>
                            <li>5 % Discount On Airport Transfer</li>
                            <li>20% off on session of Spa</li>
                            <li>Free Cancellation before 28 Jan 01:59 PM</li>
                        </ol>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
export default ImageBox