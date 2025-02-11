import { useExplorePageStore } from "@/store/useExplorePageStore"
import PlaceCard from "../ui/PlaceCard"

const locations = 
[
    {
        "name": "Vegas Mall",
        "address": "Vegas Mall, Sector 14, Dwarka, New Delhi, Delhi 110078",
        "imageURL": "https://lh5.googleusercontent.com/p/AF1QipMB5tk_VWNt8tHKOKAWpdDU_zFy8_3_v33OVApR=w408-h306-k-no",
        "googleMapsLink": "https://maps.app.goo.gl/wDEHn9EbRQGzZGb87"
    },
    {
        "name": "Vegas Mall",
        "address": "Vegas Mall, Sector 14, Dwarka, New Delhi, Delhi 110078",
        "imageURL": 'https://plus.unsplash.com/premium_photo-1661286678499-211423a9ff5e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGFydHklMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHwwfHw%3D&auto=format&fit=crop&h=2000',
        "googleMapsLink": "https://maps.app.goo.gl/wDEHn9EbRQGzZGb87"
    },
    {
        "name": "Vegas Mall",
        "address": "Vegas Mall, Sector 14, Dwarka, New Delhi, Delhi 110078",
        "imageURL": 'https://plus.unsplash.com/premium_photo-1661286678499-211423a9ff5e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGFydHklMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHwwfHw%3D&auto=format&fit=crop&h=2000',
        "googleMapsLink": "https://maps.app.goo.gl/wDEHn9EbRQGzZGb87"
    },
    {
        "name": "Vegas Mall",
        "address": "Vegas Mall, Sector 14, Dwarka, New Delhi, Delhi 110078",
        "imageURL": 'https://plus.unsplash.com/premium_photo-1661286678499-211423a9ff5e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGFydHklMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHwwfHw%3D&auto=format&fit=crop&h=2000',
        "googleMapsLink": "https://maps.app.goo.gl/wDEHn9EbRQGzZGb87"
    },
    {
        "name": "Vegas Mall",
        "address": "Vegas Mall, Sector 14, Dwarka, New Delhi, Delhi 110078",
        "imageURL": 'https://plus.unsplash.com/premium_photo-1661286678499-211423a9ff5e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGFydHklMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHwwfHw%3D&auto=format&fit=crop&h=2000',
        "googleMapsLink": "https://maps.app.goo.gl/wDEHn9EbRQGzZGb87"
    },

]

const PlaceCardsContainer = () => {
    const isHovered = false
    const { places } = useExplorePageStore() 
    return (
        <div className={`flex gap-4 overflow-x-auto scrollbar-thin ${isHovered ? 'pause' : 'animate-[scroll_20s_linear_infinite]'} `}
        >
            {places.map((location, index) => (
                <div key={index}  className='shadow-lg rounded-md p-4'>
                    <PlaceCard 
                        name={location.name}
                        address={location.address}
                        imageURL={location.imageURL}
                        googleMapsLink={location.googleMapsLink}
                    />
                </div>
            ))}
        </div>
    )
}

export default PlaceCardsContainer;
