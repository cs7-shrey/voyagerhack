import React from 'react'

interface Props {
    price: number
}

const HotelMarker: React.FC<Props> = ({ price }) => {
    return (
        <button>
            '₹' {price}
        </button>
    )
}

export default HotelMarker
