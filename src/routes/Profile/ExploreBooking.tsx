import { useEffect, useState } from 'react';
import { CopilotKit } from "@copilotkit/react-core";
import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { useCopilotContext } from "@copilotkit/react-core";
import { 
    ArrowRight
} from 'lucide-react';
import { useBookingPageStore } from '@/store/useBookingPageStore';
import { axiosInstance } from '@/lib/axiosConfig';
import { useParams } from 'react-router';
import HotelDetails from '../../components/explore/HotelDetails';
import BookingDate from '../../components/explore/BookingDate';
import RoomDetails from '@/components/explore/RoomDetails';
import PlaceCardsContainer from '@/components/explore/PlaceCardsContainer';
import Message from '@/components/explore/Message';
import { INSTRUCTION, useUITools } from '@/lib/exploreChat';
import { Sender } from '@/lib/exploreChat';
import { useExplorePageStore } from '@/store/useExplorePageStore';
import EventCardsContainer from '@/components/explore/EventCardsContainer';



const PageLayout = () => {
    const {
        visibleMessages,
        appendMessage,
        isLoading,
    } = useCopilotChat();
    
    const [inputValue, setInputValue] = useState<string>('');
    const sendMessage = async (content: string) => {
        if (content.trim()) {
            const startTime = performance.now();
            setPlaces([]);
            await appendMessage(new TextMessage({ content, role: Role.User }));
            setInputValue("");
            const endTime = performance.now();
            console.log(`Message sending took ${endTime - startTime}ms`);
        }
        // visibleMessages[0].
    };

    const { setChatInstructions } = useCopilotContext();
    
    useUITools();
    const { bookingPageState: booking, setBookingPageState } = useBookingPageStore();
    const { places, setPlaces } = useExplorePageStore();
    useEffect(() => {
        console.log(places)
    }, [places])
    const [loadingBookingData, setLoadingBookingData] = useState(false);
    const { id } = useParams();
    useEffect(() => {
        const fetchBookingData = async () => {
            setLoadingBookingData(true);
            try {
                const response = await axiosInstance.get(`/users/booking/${id}`);
                console.log(response.data)
                const data = response.data;
                setBookingPageState(data);
            } catch (error) {
                console.error('Error while fetching booking details', error)
            } finally {
                setLoadingBookingData(false)
            }
        }
        fetchBookingData()
    }, [setBookingPageState, id]);

    useEffect(() => {
        const booking = useBookingPageStore.getState().bookingPageState;
        console.log(booking?.hotel?.location)
        setChatInstructions(`
            ${INSTRUCTION}

            SYSTEM GENERATED DETAILS:
            HOTEL NAME: ${booking?.hotel?.name}
            HOTEL LOCATION: ${booking?.hotel?.location}    
            CHECK IN : ${booking?.check_in}
            CHECK OUT: ${booking?.check_out}
            ROOM TYPE: ${booking?.room_type?.room_type_name}
        `);
    }, [setChatInstructions, booking]);
    
    if (!booking || loadingBookingData) {
        console.log('returning null')
        return null;
    }   
    console.log(visibleMessages)        
    return (
        <div className="relative h-screen bg-gray-50 flex flex-col gap-2">
            {/* Hotel Header */}
            <div className='w-full flex bg-white'>
                <div className="shadow-sm p-2 w-1/4 max-h-fit justify-self-start">
                    <HotelDetails imageURL={booking.hotel.images[0]} name={booking.hotel.name} hotelStars={booking.hotel.hotel_star} address={booking.hotel.location} userRating={booking.hotel.user_rating} />
                </div>
                <div className='mx-auto'>
                    <BookingDate checkIn={new Date(booking.check_in)} checkOut={new Date(booking.check_out)}/>
                </div>
                <div className='ml-auto'>
                    <RoomDetails roomType={booking.room_type.room_type_name} roomDescription='Room with Free cancellation' maxAdults={booking.room_type.max_adults} />
                </div>
            </div>

            {/* Let's Explore Section */}
            <div className='w-full overflow-y-auto'>
                <div className='flex flex-col max-w-5xl mx-auto py-4 px-4 '>
                    {visibleMessages.length === 0 && 
                        <h2 className="text-[4.5rem] text-center text-gray-900 mb-6 font-manrope font-[600]">
                            let's explore
                        </h2>
                    }
                    <div className='flex flex-col gap-4'>
                        <div className='px-4 flex flex-col gap-2'>
                            {visibleMessages.map((msg, index) => {
                                if (!msg.isTextMessage()) {
                                    return null;
                                }
                                const textMsg = msg as TextMessage;
                                if ((textMsg.role !== Role.User && textMsg.role !== Role.Assistant) || textMsg.content.trim().length === 0) {
                                    return null;
                                }
                                return (
                                    <Message 
                                        key={index} 
                                        content={textMsg.content} 
                                        sender={textMsg.role === Role.User ? Sender.USER : Sender.AGENT} 
                                        isThinking={false}
                                    />
                                )
                            })}
                            {isLoading && 
                            (
                                !visibleMessages?.[visibleMessages.length - 1].isTextMessage() ||
                                (
                                    visibleMessages?.[visibleMessages.length - 1].isTextMessage() && (visibleMessages?.[visibleMessages.length - 1] as TextMessage).content.trim().length === 0
                                )
                            )
                                && <Message content='foo' sender={Sender.AGENT} isThinking={true} />}
                        </div>
                        <div>
                            <PlaceCardsContainer />    
                            <EventCardsContainer />
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Input */}
            <div className='w-full mt-auto'>
                <div className="bg-white mx-auto flex w-1/2 p-4 items-center gap-2 rounded-sm shadow-md ">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessage(inputValue);
                            }
                        }}
                        disabled={isLoading}
                        className='w-full focus:outline-none' 
                        placeholder='write here...'
                    />
                    <button
                        disabled={isLoading}
                        onClick={() => sendMessage(inputValue)}
                    >
                        <ArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

const ExplorePage = () => {
    return (
        <CopilotKit runtimeUrl={import.meta.env.VITE_COPILOT_RUNTIME_URL}>
            <PageLayout />
        </CopilotKit>
    )
}

export default ExplorePage;