import React from 'react';

interface Props {
    checkIn: Date;
    checkOut: Date;
}

const BookingDate:React.FC<Props> = ({ checkIn, checkOut }) => {
    // Format date to "Sun, 16 Feb, 2025" style
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };


    return (
        <div className="flex items-center gap-8 px-4 py-2 bg-white rounded-lg">
            <div className="space-y-1">
                <div className="text-gray-600 text-sm">Check In</div>
                <div className="font-semibold">{formatDate(checkIn)}</div>
                <div className="text-gray-600 text-sm">12 PM</div>
            </div>

            <div className="space-y-1">
                <div className="text-gray-600 text-sm">Check Out</div>
                <div className="font-semibold">{formatDate(checkOut)}</div>
                <div className="text-gray-600 text-sm">11 AM</div>
            </div>
        </div>
    );
};

export default BookingDate;