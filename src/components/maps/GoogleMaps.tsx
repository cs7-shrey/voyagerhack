import { useHotelStore } from "@/store/useHotelStore";
import { APIProvider, Map, MapCameraChangedEvent, AdvancedMarker } from "@vis.gl/react-google-maps";
import HotelMarker from "./HotelMarker";

const GoogleMaps = () => {
    // import hotel
    const { hotels } = useHotelStore();
    return (
        <div className='w-full h-[70vh]'>
            <APIProvider apiKey={import.meta.env.VITE_MAPS_FRONTEND_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
                <Map
                    defaultZoom={13}
                    defaultCenter={ { lat: -33.860664, lng: 151.208138 } }
                    mapId='DEMO_MAP_ID'
                    onCameraChanged={ (ev: MapCameraChangedEvent) =>
                        console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                    }
                >
                    {hotels.map((hotel) => {
                        return (
                            <AdvancedMarker
                                key={hotel.id}
                                latitude={hotel.latitude}
                                longitude={hotel.longitude}
                                offsetLeft={-20}
                                offsetTop={-10}
                            >
                                <HotelMarker price={hotel.base_fare ?? 0} />
                            </AdvancedMarker>
                        )
                    })}
                </Map>
            </APIProvider>
        </div>
    )
}
export default GoogleMaps;