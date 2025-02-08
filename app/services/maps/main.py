from app.services.maps.autocomplete import place_autocomplete
from app.services.maps.geocoding import Coordinate, geocode_place_id


async def geocode_to_most_relevant(place: str) -> Coordinate:
    if not place: 
        return
    place_id = await place_autocomplete(place)
    if not place_id: 
        return
    return await geocode_place_id(place_id)