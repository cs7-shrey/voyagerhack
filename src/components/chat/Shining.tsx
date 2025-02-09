import { APIProvider, Map, MapCameraChangedEvent, Pin, AdvancedMarker } from "@vis.gl/react-google-maps"


type Poi ={ key: string, location: google.maps.LatLngLiteral }
const locations: Poi[] = [
    {key: 'operaHouse', location: { lat: -33.8567844, lng: 151.213108  }},
    {key: 'tarongaZoo', location: { lat: -33.8472767, lng: 151.2188164 }},
    {key: 'manlyBeach', location: { lat: -33.8209738, lng: 151.2563253 }},
    {key: 'hyderPark', location: { lat: -33.8690081, lng: 151.2052393 }},
    {key: 'theRocks', location: { lat: -33.8587568, lng: 151.2058246 }},
    {key: 'circularQuay', location: { lat: -33.858761, lng: 151.2055688 }},
    {key: 'harbourBridge', location: { lat: -33.852228, lng: 151.2038374 }},
    {key: 'kingsCross', location: { lat: -33.8737375, lng: 151.222569 }},
    {key: 'botanicGardens', location: { lat: -33.864167, lng: 151.216387 }},
    {key: 'museumOfSydney', location: { lat: -33.8636005, lng: 151.2092542 }},
    {key: 'maritimeMuseum', location: { lat: -33.869395, lng: 151.198648 }},
    {key: 'kingStreetWharf', location: { lat: -33.8665445, lng: 151.1989808 }},
    {key: 'aquarium', location: { lat: -33.869627, lng: 151.202146 }},
    {key: 'darlingHarbour', location: { lat: -33.87488, lng: 151.1987113 }},
    {key: 'barangaroo', location: { lat: - 33.8605523, lng: 151.1972205 }},
]; 

// const Parser = ({text}: {text: string}) => {
//     const chars = [...text];
//     const start = 1;
//     const end = 0.5;
//     const [opacities, setOpacities] = useState([...chars.map((_, index) => {
//         return end - (end - start) * (index) / (text.length - 1)
//     })])
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setOpacities((prev) => rotateArrayRight(prev))
//         }, 100)
//         return () => clearInterval(interval);
//     }, [])
//     return chars.map((char, index) => {
//         return (
//             <div>
//                 <APIProvider apiKey={import.meta.env.VITE_MAPS_FRONTEND_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
//                     <Map
//                         defaultZoom={13}
//                         defaultCenter={ { lat: -33.860664, lng: 151.208138 } }
//                         onCameraChanged={ (ev: MapCameraChangedEvent) =>
//                             console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
//                         }>
//                     </Map>
//                 </APIProvider> 
//             </div>
//         );
//     });
// }

const PoiMarkers = (props: {pois: Poi[]}) => {
    return (
        <>
            {props.pois.map( (poi: Poi) => (
                <AdvancedMarker
                    key={poi.key}
                    position={poi.location}>
                    <Pin background={'#D24D5C'} glyphColor={'#ffffff'} borderColor={'#D24D5C'} />
                </AdvancedMarker>
            ))}
        </>
    );
};
  
const Shining = () => {
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
                    <PoiMarkers pois={locations} />
                </Map>
            </APIProvider>
        </div>
    )
}

export default Shining
