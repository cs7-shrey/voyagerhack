import { useExplorePageStore } from "@/store/useExplorePageStore"
import PlaceCard from "../ui/PlaceCard"

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
