import { useHotelStore } from "@/store/useHotelStore";
import { APIProvider, Map, MapCameraChangedEvent, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import HotelMarker from "./HotelMarker";
import { PiMapPinFill } from "react-icons/pi";
import { useSearchStore } from "@/store/useSearchStore";

interface Position {
    lat: number;
    lng: number
}
const GoogleMaps = () => {
    const { hotels, selectedHotelId } = useHotelStore();
    const [center, setCenter] = useState<Position | null>(null);
    const [defaultCenter, setDefaultCenter] = useState<Position | null>(null);
    const { proximityCoordinate } = useSearchStore();
    useEffect(() => {
        if (hotels.length === 0) {
            return;
        }
        console.log(proximityCoordinate)
        const mapCenter = 
        proximityCoordinate ? 
            {
                'lat': proximityCoordinate.latitude,
                'lng': proximityCoordinate.longitude,
            }
            :
            hotels.reduce((acc, hotel) => {
                acc.lat += hotel.latitude / hotels.length;
                acc.lng += hotel.longitude / hotels.length;
                return acc;
            }, { lat: 0, lng: 0 });
        setCenter(mapCenter);
        setDefaultCenter(mapCenter)
    }, [hotels, proximityCoordinate]);

    if (!center || !hotels || !defaultCenter) {
        console.log('returning')
        return <div className="mx-auto">Loading map...</div>;
    }
    console.log('center', center)

    return (
        <div className='w-full h-full relative z-40'>
            <APIProvider apiKey={import.meta.env.VITE_MAPS_FRONTEND_API_KEY}>
                <Map
                    defaultZoom={12}
                    defaultCenter={defaultCenter}
                    center={center}
                    mapId={'ad42606e9487d04c'}
                    mapTypeControl={false}
                    clickableIcons={false}
                    disableDoubleClickZoom={true}
                    onCameraChanged={(ev: MapCameraChangedEvent) => {
                        console.log('camera changed:', ev.detail.center)
                        setCenter(ev.detail.center)
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
                    <AdvancedMarker zIndex={50} position={defaultCenter} clickable={true}>
                        <PiMapPinFill fill="#D24D5C" size={36} />
                    </AdvancedMarker>
                </Map>
            </APIProvider>
        </div>
    );
};

export default GoogleMaps;