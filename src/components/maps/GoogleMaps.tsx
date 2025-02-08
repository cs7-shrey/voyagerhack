import { useHotelStore } from "@/store/useHotelStore";
import { APIProvider, Map, MapCameraChangedEvent, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import HotelMarker from "./HotelMarker";

interface Position {
    lat: number;
    lng: number
}
const GoogleMaps = () => {
    const { hotels, selectedHotelId } = useHotelStore();
    const [center, setCenter] = useState<Position | null>(null);
    useEffect(() => {
        if (hotels.length === 0) {
            return;
        }

        const meanCenter = hotels.reduce((acc, hotel) => {
            acc.lat += hotel.latitude / hotels.length;
            acc.lng += hotel.longitude / hotels.length;
            return acc;
        }, { lat: 0, lng: 0 });
        setCenter(meanCenter);
    }, [hotels]);

    if (!center || !hotels) {
        console.log('returning')
        return <div className="mx-auto">Loading map...</div>;
    }
    console.log(center)

    return (
        <div className='w-full h-full relative z-40'>
            <APIProvider apiKey={import.meta.env.VITE_MAPS_FRONTEND_API_KEY}>
                <Map
                    defaultZoom={12}
                    defaultCenter={center}
                    mapId={'32c1d9a2aa431555'}
                    mapTypeControl={false}
                    clickableIcons={false}
                    disableDoubleClickZoom={true}
                    onCameraChanged={(ev: MapCameraChangedEvent) => {
                        console.log('camera changed:', ev.detail.center)
                    }
                    }
                >
                    {hotels.map((hotel) => (
                        <AdvancedMarker
                            key={hotel.id}
                            position={{ lat: hotel.latitude, lng: hotel.longitude }}
                            clickable={true}
                            zIndex={hotel.id === selectedHotelId ? 50 : 40}
                            // style={hotel.id === selectedHotelId ? { zIndex: 50 } : { zIndex: 40 }}
                        >
                            <HotelMarker price={hotel.base_fare ?? 0} hotelId={hotel.id}/>
                        </AdvancedMarker>
                    ))}
                </Map>
            </APIProvider>
        </div>
    );
};

export default GoogleMaps;