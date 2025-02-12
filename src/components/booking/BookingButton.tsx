import { Wallet } from 'lucide-react';
import { ClipLoader } from 'react-spinners';

interface Props {
    onClick: () => void;
    disabled?: boolean;
}
const BookingButton: React.FC<Props> = ({ onClick, disabled }) => {
    const isOpen = true;
    return (
        <div className="w-full max-w-md space-y-4">

            {/* Payment options panel */}
            {isOpen && (
                <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-md cursor-pointer">
                        <div className="flex items-center gap-2 flex-1">
                            <Wallet className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-900">Pay via HAVEN wallet</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Main booking button */}
            <div className='relative'>
                <button
                    onClick={onClick}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                        Book Room
                </button>
                {
                    disabled && (
                        <div className="absolute inset-0 z-50 bg-secondary/80 h-full flex items-center justify-center w-full border "
                        >
                            <ClipLoader color='white' size={20}/>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default BookingButton;