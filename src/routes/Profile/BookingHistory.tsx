import { useEffect, useState } from 'react';
import { MapPin, Users, Star } from 'lucide-react';
import { axiosInstance } from '@/lib/axiosConfig';
import { useBookingHistoryStore } from '@/store/useBookingHistoryStore';
import { useNavigate } from 'react-router';

const BookingHistory = () => {
    const { bookings, setBookings } = useBookingHistoryStore();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // Assuming this endpoint returns joined data from all relevant tables
                const response = await axiosInstance.get('/users/bookings');
                console.log(response)
                setBookings(response.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [setBookings]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>
        
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking.booking_id} className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Hotel Image */}
                                <div className="w-full md:w-1/4 flex flex-col">
                                    <img
                                        src={booking.hotel.images[0]}
                                        alt={booking.hotel.name}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <div className='bg-black text-white text-center py-2 rounded-lg mt-2'>
                                        <button
                                            onClick={() => navigate(`/profile/booking/explore/${booking.booking_id}`)}
                                        >
                                            explore
                                        </button>
                                    </div>
                                </div>

                                {/* Booking Details */}
                                <div className="flex-1 space-y-4">
                                    {/* Hotel Info */}
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                {booking.hotel.name}
                                            </h2>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                                <span className="text-gray-600">{booking.hotel.user_rating}/5</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600 mt-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{booking.hotel.location}</span>
                                        </div>
                                    </div>

                                    {/* Room & Guest Info */}
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-5 h-5 text-gray-500" />
                                            <span className="text-gray-600">{booking.room_type.max_adults} Adults</span>
                                        </div>
                                        <div className="text-gray-600">{booking.room_type.room_type_name}</div>
                                    </div>

                                    {/* Check-in/Check-out */}
                                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="text-sm text-gray-600">Check In</div>
                                            <div className="font-semibold">{formatDate(booking.check_in)}</div>
                                            <div className="text-sm text-gray-600">{formatTime(booking.check_in)}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Check Out</div>
                                            <div className="font-semibold">{formatDate(booking.check_out)}</div>
                                            <div className="text-sm text-gray-600">{formatTime(booking.check_out)}</div>
                                        </div>
                                    </div>

                                    {/* Price Summary */}
                                    <div className="border-t pt-4 mt-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Base Price</span>
                                            <span>₹{booking.rate_plan.base_fare}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mt-1">
                                            <span className="text-gray-600">Discount</span>
                                            <span className="text-green-500">-₹{booking.rate_plan.total_discount}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mt-1">
                                            <span className="text-gray-600">Taxes & Fees</span>
                                            <span>₹{booking.rate_plan.taxes}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
                                            <span>Total Paid</span>
                                            <span>₹{booking.rate_plan.base_fare - booking.rate_plan.total_discount + booking.rate_plan.taxes}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BookingHistory;