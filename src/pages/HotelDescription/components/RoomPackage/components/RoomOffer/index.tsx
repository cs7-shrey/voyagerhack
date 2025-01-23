import "./room-offer.css"
const RoomOffer=()=>{
    return (
        <div className="room-offer">
            <div className="room-offer-details">
                <div className="room-name" style={{margin:"5%"}}>
                    <b>1. Room Only | Free Cancellation</b>
                </div>
                <ol>
                    <li>Free Honeymoon package</li>
                    <li>Free In-room refreshments</li>
                    <li>10% off on session of spa</li>
                    <li style={{color:"green"}}>20% off on Food and Beverages</li>
                </ol>
            </div>
            <div className="room-pricing">                                
                <h2>
                    <span style={{fontWeight:"300"}}>₹</span>9,304
                </h2>
                <p>+₹2,334 taxes & fees<br/>
                    <span>1 Room</span> per night
                </p>
                <button className="downlink">
                    <p>
                        SELECT ROOM
                    </p>
                </button>
            </div>
        </div>
    )
}
export default RoomOffer;