from ..utils.search_suggestions import get_suggestions, get_suggestion_space
from app import models
from app.database import get_db
from sqlalchemy.orm import Session
from app.schemas import ProximityCoordinate, SearchFilters, SearchHotelsRequest, HotelSearchResponse, SearchSuggestion
from app.services.crud.hotel.filter import get_hotels_with_filters
from app.services.maps.autocomplete import place_autocomplete
from app.services.maps.geocoding import geocode_place_id
from fastapi import FastAPI, APIRouter, Depends
import time

router = APIRouter(prefix="/search", tags=["search"])

suggestion_search_space = get_suggestion_space()
@router.get("/suggestions", response_model=list[SearchSuggestion]) 
def search_suggestions(search_term: str):
    results = get_suggestions(search_term, suggestion_search_space)
    return results

@router.post("/hotels", response_model=HotelSearchResponse)
async def get_hotels(search_term: str, type: str, filters: SearchHotelsRequest, db: Session = Depends(get_db)):
    place_id = None
    proximity_coordinate = None
    # coordinate existing by default
    if filters.proximity_coordinate and (filters.proximity_coordinate.latitude or filters.proximity_coordinate.longitiude):
        search_filters = SearchFilters(**filters.model_dump())
    # implicit location but no coordinate
    elif filters.near:
        proximity_location = filters.near
        place_id = await place_autocomplete(proximity_location)
        if place_id:
            coordinate = await geocode_place_id(place_id)
            proximity_coordinate = ProximityCoordinate(latitude=coordinate['latitude'], longitiude=coordinate['longitude'])
            filters_dict = filters.model_dump()
            print(filters_dict)
            del filters_dict['proximity_coordinate']   
        search_filters = SearchFilters(**filters_dict, proximity_coordinate=proximity_coordinate)
    else: 
        search_filters = SearchFilters(**filters.model_dump())
    print(search_filters)
    hotels = get_hotels_with_filters(search_filters, db)
    return {
        'hotels': hotels,
        'proximity_coordinate': proximity_coordinate,
        'near': filters.near if filters.near else ''        # TODO: change this near to the autocomplete location given by google's api
    }
    # return [schemas.HotelSearchResponse(id=hotel.id, name=hotel.name, location=hotel.location, base_fare=hotel.base_fare, hotel_star=hotel.hotel_star, user_rating=hotel.user_rating, user_rating_count=hotel.user_rating_count, images=hotel.images) for hotel in hotels]