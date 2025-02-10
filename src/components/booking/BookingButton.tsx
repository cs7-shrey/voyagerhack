import { Wallet } from 'lucide-react';

interface Props {
    onClick: () => void;
}
const BookingButton: React.FC<Props> = ({ onClick }) => {
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
            <button
                onClick={onClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
        Book Room
            </button>
        </div>
    );
};

export default BookingButton;