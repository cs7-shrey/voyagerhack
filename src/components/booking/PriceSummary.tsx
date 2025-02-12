import React from 'react';

interface PriceSummaryProps {
  baseFare: number;
  discount: number;
  taxes: number;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({ baseFare, discount, taxes }) => {
    const priceAfterDiscount = baseFare - discount;
    const totalAmount = priceAfterDiscount + taxes;

    // Format number to Indian currency format
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price).replace('INR', '₹');
    };

    return (
        <div className="w-full max-w-md p-4 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Price Summary</h2>
      
            <div className="space-y-3 text-[0.9rem]">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Base Price (1 room x 1 night)</span>
                    <span className="text-gray-900">{formatPrice(baseFare)}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Discount</span>
                    <span className="text-green-500">-{formatPrice(discount)}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Price after Discount</span>
                    <span className="text-gray-900">{formatPrice(priceAfterDiscount)}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Taxes & Service Fees</span>
                    <span className="text-gray-900">{formatPrice(taxes)}</span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-200 font-bold">
                    <span className="text-gray-900">Total Amount to be paid</span>
                    <span className="text-gray-900">{formatPrice(totalAmount)}</span>
                </div>
            </div>
        </div>
    );
};

export default PriceSummary;