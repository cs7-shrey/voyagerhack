import { useExplorePageStore } from "@/store/useExplorePageStore"
import PlaceCard from "../ui/PlaceCard"

const PlaceCardsContainer = () => {
    const isHovered = false
    const { places } = useExplorePageStore() 
    return (
        <div className={`flex gap-4 overflow-x-auto scrollbar-thin bg-[rgb(247,247,247)]  ${isHovered ? 'pause' : 'animate-[scroll_20s_linear_infinite]'} `}
        >
            {places.map((location, index) => (
                <div key={index}  className=' rounded-md p-4 bg-white'>
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
