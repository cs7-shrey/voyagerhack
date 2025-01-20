from fastapi import FastAPI, APIRouter, Depends
from ..utils.search_suggestions import get_suggestions, get_suggestion_space
from .. import schemas, models
from ..database import get_db
from sqlalchemy.orm import Session
from app.services.hotel_filter import get_hotels_with_filters

router = APIRouter(prefix="/search", tags=["search"])

suggestion_search_space = get_suggestion_space()
@router.get("/suggestions/", response_model=list[schemas.SearchSuggestion]) 
def search_suggestions(search_term: str):
    results = get_suggestions(search_term, suggestion_search_space)
    return results

@router.post("/hotels", response_model=list[schemas.HotelSearchResponse])
def get_hotels(search_term: str, type: str, filters: schemas.SearchFilters, db: Session = Depends(get_db)):
    # so, type can be location or city or hotel
    print(filters)
    hotels = get_hotels_with_filters(filters, db)
    print("hotels: ")
    return hotels
    # return [schemas.HotelSearchResponse(id=hotel.id, name=hotel.name, location=hotel.location, base_fare=hotel.base_fare, hotel_star=hotel.hotel_star, user_rating=hotel.user_rating, user_rating_count=hotel.user_rating_count, images=hotel.images) for hotel in hotels]