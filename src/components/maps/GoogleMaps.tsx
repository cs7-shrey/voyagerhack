// import { useHotelStore } from "@/store/useHotelStore";
// import { APIProvider, Map, MapCameraChangedEvent, AdvancedMarker } from "@vis.gl/react-google-maps";
// import { useState, useEffect } from "react";
// import HotelMarker from "./HotelMarker";
// import { PiMapPinFill } from "react-icons/pi";
// import { useSearchStore } from "@/store/useSearchStore";

// interface Position {
//     lat: number;
//     lng: number
// }
// const GoogleMaps = () => {
//     const { hotels, selectedHotelId } = useHotelStore();
//     const [center, setCenter] = useState<Position | null>(null);
//     const [defaultCenter, setDefaultCenter] = useState<Position | null>(null);
//     const { proximityCoordinate } = useSearchStore();
//     useEffect(() => {
//         if (hotels.length === 0) {
//             return;
//         }
//         console.log(proximityCoordinate)
//         const mapCenter = 
//         proximityCoordinate ? 
//             {
//                 'lat': proximityCoordinate.latitude,
//                 'lng': proximityCoordinate.longitude,
//             }
//             :
//             hotels.reduce((acc, hotel) => {
//                 acc.lat += hotel.latitude / hotels.length;
//                 acc.lng += hotel.longitude / hotels.length;
//                 return acc;
//             }, { lat: 0, lng: 0 });
//         setCenter(mapCenter);
//         setDefaultCenter(mapCenter)
//     }, [hotels, proximityCoordinate]);

//     if (!center || !hotels || !defaultCenter) {
//         console.log('returning')
//         return <div className="mx-auto">Loading map...</div>;
//     }
//     console.log('center', center)

//     return (
//         <div className='w-full h-full relative z-40'>
//             <APIProvider apiKey={import.meta.env.VITE_MAPS_FRONTEND_API_KEY}>
//                 <Map
//                     defaultZoom={12}
//                     defaultCenter={defaultCenter}
//                     center={center}
//                     mapId={'ad42606e9487d04c'}
//                     mapTypeControl={false}
//                     clickableIcons={false}
//                     disableDoubleClickZoom={true}
//                     onCameraChanged={(ev: MapCameraChangedEvent) => {
//                         console.log('camera changed:', ev.detail.center)
//                         setCenter(ev.detail.center)
//                     }
//                     }
//                 >
//                     {hotels.map((hotel) => (
//                         <AdvancedMarker
//                             key={hotel.id}
//                             position={{ lat: hotel.latitude, lng: hotel.longitude }}
//                             clickable={true}
//                             zIndex={hotel.id === selectedHotelId ? 50 : 40}
//                             // style={hotel.id === selectedHotelId ? { zIndex: 50 } : { zIndex: 40 }}
//                         >
//                             <HotelMarker price={hotel.base_fare ?? 0} hotelId={hotel.id}/>
//                         </AdvancedMarker>
//                     ))}
//                     <AdvancedMarker zIndex={50} position={defaultCenter} clickable={true}>
//                         <PiMapPinFill fill="#D24D5C" size={36} />
//                     </AdvancedMarker>
//                 </Map>
//             </APIProvider>
//         </div>
//     );
// };

// export default GoogleMaps;
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


function findCenterAndZoom(coordinateList: Position[]) {
    const R = 6378137; // Earth's radius in meters

    function latLonToMercator(lat: number, lon: number): [number, number] {
        const x = R * (lon * Math.PI / 180);
        const y = R * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI / 360)));
        return [x, y];
    }

    function mercatorToLatLon(x: number, y: number): Position {
        const lon = (x / R) * (180 / Math.PI);
        const lat = (Math.atan(Math.sinh(y / R))) * (180 / Math.PI);
        return { lat, lng: lon };
    }

    const mercatorCoordinates = coordinateList.map(({ lat, lng }) => latLonToMercator(lat, lng));

    const centralX = mercatorCoordinates.reduce((sum, coord) => sum + coord[0], 0) / mercatorCoordinates.length;
    const centralY = mercatorCoordinates.reduce((sum, coord) => sum + coord[1], 0) / mercatorCoordinates.length;

    const distancesFromCenter = mercatorCoordinates
        .map(([x, y]) => Math.sqrt((x - centralX) ** 2 + (y - centralY) ** 2))
        .sort((a, b) => a - b);

    const distancePerPixel = Array.from({ length: 22 }, (_, i) => 40075016.68 / (Math.pow(2, i) * 256));
    const mapLengthPerZoomLevel = distancePerPixel.map(d => d * 250).reverse();

    const targetVal = distancesFromCenter[Math.max(Math.floor(0.8 * distancesFromCenter.length) - 1, 0)];

    let i = 0;
    while (i < 21 && targetVal > mapLengthPerZoomLevel[i]) {
        i++;
    }

    if (i > 0 && targetVal < 0.7 * mapLengthPerZoomLevel[i]) {
        i--;
    }

    return { center: mercatorToLatLon(centralX, centralY), zoom: 21 - i };
}
const GoogleMaps = () => {
    const { hotels, selectedHotelId } = useHotelStore();
    const [center, setCenter] = useState<Position | null>(null);
    const [defaultCenter, setDefaultCenter] = useState<Position | null>(null);
    const [zoom,setZoom]=useState<number>(12)
    const { proximityCoordinate } = useSearchStore();
    useEffect(() => {
        if (hotels.length === 0) {
            return;
        }
        console.log(proximityCoordinate)
        
        const coordinateList=hotels.map((hotel)=>({lat:hotel.latitude,lng:hotel.longitude}))
        const {center,zoom}=findCenterAndZoom(coordinateList)
        // const mapCenter = 
        // proximityCoordinate ? 
        //     {
        //         'lat': proximityCoordinate.latitude,
        //         'lng': proximityCoordinate.longitude,
        //     }
        //     :
        //     hotels.reduce((acc, hotel) => {
        //         acc.lat += hotel.latitude / hotels.length;
        //         acc.lng += hotel.longitude / hotels.length;
        //         return acc;
        //     }, { lat: 0, lng: 0 });
        setCenter(center);
        setDefaultCenter(center)
        console.log(zoom)
        setZoom(zoom)
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
                    defaultZoom={zoom}
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