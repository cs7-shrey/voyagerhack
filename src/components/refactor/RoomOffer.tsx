import { type RatePlan } from "@/store/useHotelDescStore";
// type Props = RatePlan
interface Props extends RatePlan {
  sNo: number
}
const RoomOffer: React.FC<Props> = (ratePlan) => {
  const formatRoomOffer = (filter_code: string[]) => {

    if (filter_code.includes("FREE_BREAKFAST") && filter_code.includes("FREE_CANCELLATION")) {
      return "Free Breakfast | Free Cancellation"
    } 
    else if (filter_code.includes("FREE_BREAKFAST")) {
      return "Room Only | Free Breakfast"
    }
    else if (filter_code.includes("FREE_CANCELLATION")) {
      return "Room Only | Free Cancellation"
    }
    else {
      return "Room Only"
    }
  }
    return (
      <div className="flex w-full min-h-[245px] border-b border-[#001843] ">
        {/* Left Section */}
        <div className="flex-1 h-full">
          <div className="m-[5%]">
            <b>{ratePlan.sNo}. {formatRoomOffer(ratePlan.filter_code)}</b>
          </div>
          <ol className="mx-[10%] text-gray-500 list-disc text-[0.75rem] md:text-[0.85rem] lg:text-[0.9rem]">
            {
              ratePlan.filter_code.includes("FREE_CANCELLATION") ?
              <li className="text-green-500">Free cancellation</li> :
              <li className="text-red-500">Non Refundable</li>
            }
            {
              ratePlan.filter_code.includes("FREE_BREAKFAST") ?
              <li className="text-green-500">Free breakfast</li> :
              ""
            }
          </ol>
        </div>
  
        {/* Right Section */}
        <div className="flex flex-col justify-start flex-1 h-full border-l-2 px-3">
          <h2 className="mt-[5%] text-[1.24rem] md:text-2xl font-bold text-secondary">
            <span className="font-light">₹</span>{ratePlan.base_fare}
          </h2>
          <p className="mx-1 text-xs md:text-[0.8rem] text-secondary/60">
            +₹{ratePlan.taxes} taxes & fees<br/>
            <span className="font-bold">1 Room</span> per night
          </p>
          <button className="mt-[7.5%] py-2 min-h-[40px] w-full md:w-[80%] lg:w-[60%] rounded-lg flex items-center justify-center 
              font-bold p-2
              bg-accent text-white text-xs md:text-[0.75rem] lg:text-[0.8rem]
              sm:mt-[4%]"
          >
              SELECT ROOM
          </button>
        </div>
      </div>
    );
  };
  
  export default RoomOffer;