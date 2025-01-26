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
        <div className="flex-1 h-full bg-[#05203C]">
          <h2 className="mt-[15%] ml-[5%] text-[1.7rem] md:text-3xl font-bold text-white">
            <span className="font-light">₹</span>{ratePlan.base_fare}
          </h2>
          <p className="ml-[5%] text-xs md:text-sm text-[#bab9b9]">
            +₹{ratePlan.taxes} taxes & fees<br/>
            <span className="font-bold">1 Room</span> per night
          </p>
          <button className="ml-[25%] mt-[7.5%] h-[50px] w-[50%] rounded-lg flex items-center justify-center 
              font-bold p-[0.15%] pl-0 border border-white shadow-[0px_0px_50px_black] 
              bg-gradient-to-r from-[var(--accent)]
              sm:mt-[4%]">
            <p className="text-white hf-full w-full flex items-center justify-center rounded-lg ml-[1%] 
                md:text-xs">
              SELECT ROOM
            </p>
          </button>
        </div>
      </div>
    );
  };
  
  export default RoomOffer;