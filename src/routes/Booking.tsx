import BookingHotelInfo from "@/components/booking/BookingHotelnfo";
import Logo from "@/components/ui/Logo";
import { axiosInstance } from "@/lib/axiosConfig";
import { useHotelDescStore } from "@/store/useHotelDescStore";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router"
import placeholderImg from "/placeholderImg.jpg"
import BookingDate from "@/components/booking/BookingDate";
import PriceSummary from "@/components/booking/PriceSummary";
import BookintRoomDetails from "@/components/booking/BookingRoomDetails";
import { formatRoomOffer } from "@/lib/utils";
import BookingButton from "@/components/booking/BookingButton";

interface RatePlanDetails {
    base_fare: number;
    taxes: number;
    total_discount: number;
    plan_id: number;
    filter_code: string[];
}

interface RoomData {
    room_type_id: number;
    room_type_name: string;
    max_adults: number;
}

const getRoomInfo = async (roomId: string) => {
    try {
        const response = await axiosInstance.get(`/room/${roomId}`) 
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error(error)
    }
}
const getRatePlan = async (ratePlanId: string) => {
    try {
        const response = await axiosInstance.get(`/room/rate_plan/${ratePlanId}`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}
const Booking = () => {
    const [searchParams] = useSearchParams();
    const { getHotelData } = useHotelDescStore();
    const checkInString = searchParams.get('checkIn');
    const checkOutString = searchParams.get('checkOut');
    const hotelId = searchParams.get('hotelId');
    const roomTypeId = searchParams.get('roomTypeId');
    const planId = searchParams.get('planId');
    const { hotelData } = useHotelDescStore();
    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [ratePlan, setRatePlan] = useState<RatePlanDetails>();
    useEffect(() => {
        if (hotelId) {
            getHotelData(hotelId)
        }
        const setDataFromAPI = async () => {
            if (roomTypeId && planId) {
                const roomInfo = await getRoomInfo(roomTypeId);
                console.log(roomInfo)
                setRoomData(roomInfo);
                const ratePlanInfo = await getRatePlan(planId);   
                setRatePlan(ratePlanInfo); 
            }
        }
        setDataFromAPI();
    }, [getHotelData, hotelId, roomTypeId, planId])
    
    if (!checkInString || !checkOutString || !hotelId || !roomTypeId || !planId) {
        return <div>
            invalid url
        </div>
        // redirect laters
    }
    const bookHotel = async () => {
        try {
            const response = await axiosInstance.post('/hotel/book', {
                hotel_id: hotelId,
                room_type_id: roomTypeId,
                rate_plan_id: planId,
                check_in: checkInString,
                check_out: checkOutString
            })
            console.log(response.data)
            // do some navigation
        } catch (error) {
            console.error(error);
            // do some navigation
        }
    }
    return (
        <div className='relative flex flex-col z-10 bg-primary/80'>
            <div className='m-4 z-30 bg-accent'>
                <Logo />
            </div>
            <div className='absolute top-0 left-0 h-[40vh] w-full bg-accent z-20'>
            </div>
            <div className='flex z-30 justify-between max-w-full gap-4 mt-20 mx-8'>
                <div className='w-[50%] bg-primary rounded-lg p-4 shadow-md'>
                    <div>
                        <div className='text-xl font-extrabold'>
                            PROPERTY INFO
                        </div>
                        <hr/>   
                        <div className='mt-6'>
                            <BookingHotelInfo 
                                imageURL={hotelData?.images[0] ?? placeholderImg} 
                                name={hotelData?.name ?? ''}
                                hotelStars={hotelData?.hotelStar ?? 0}
                                userRating={hotelData?.userRating ?? 0}
                                userRatingCount={hotelData?.userRatingCount ?? 0}
                                address={hotelData?.location ?? ''}
                            />
                        </div>
                        <div className='mt-2'>
                            <BookingDate checkIn={new Date(checkInString)} checkOut={new Date(checkOutString)} />
                        </div>
                        <div className='mt-2'>
                            <BookintRoomDetails 
                                roomType={roomData?.room_type_name ?? ''} 
                                roomDescription={formatRoomOffer(ratePlan?.filter_code ?? [])}
                                maxAdults={roomData?.max_adults ?? 0}
                                cancellationText={ratePlan?.filter_code.includes('FREE_CANCELLATION') ? 'Free cancellation' : 'Non Refundable'}
                            />
                        </div>
                        <div className='mt-2'>
                            <BookingButton onClick={bookHotel}/>
                        </div>
                    </div>
                </div>
                <div className='w-[30%] bg-primary rounded-lg shadow-md h-fit'>
                    <PriceSummary baseFare={ratePlan?.base_fare ?? 0} taxes={ratePlan?.taxes ?? 0} discount={ratePlan?.total_discount ?? 0}/>
                </div>
            </div>
            {/* <button>
                Book hotel
            </button> */}
        </div>
    )
}

export default Booking
