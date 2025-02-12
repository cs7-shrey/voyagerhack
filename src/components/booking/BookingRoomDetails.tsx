import React from 'react';
import { Users } from 'lucide-react';

interface RoomDetailsProps {
  roomType: string;
  maxAdults: number;
  roomDescription: string;
  cancellationText: string;
}

const BookintRoomDetails: React.FC<RoomDetailsProps> = ({
    roomType,
    maxAdults,
    roomDescription,
}) => {
    return (
        <div className="flex justify-between p-4 max-w-4xl">
            {/* Left Section */}
            <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900">{roomType}</h2>
        
                <div className="flex items-center gap-2 text-gray-600">
                    <Users size={20} />
                    <span>{maxAdults} Adults</span>
                </div>
        
                <div className="space-y-1">
                    <div className="text-gray-700">{roomDescription}</div>
                    {/* <div className="text-green-500 text-sm">{cancellationText}</div> */}
                </div>
            </div>

        </div>
    );
};

export default BookintRoomDetails;