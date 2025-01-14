from fastapi import FastAPI, APIRouter, Depends
from ..utils.search_suggestions import get_suggestions
from .. import schemas, models
from ..database import get_db
from sqlalchemy.orm import Session
from app.services.hotel_filter import get_hotels_with_filters

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/suggestions/", response_model=list[schemas.SearchSuggestion]) 
def search_suggestions(search_term: str):
    results = get_suggestions(search_term)
    return results

@router.post("/hotels", response_model=list[schemas.HotelSearchResponse])
def get_hotels(search_term: str, type: str, filters: schemas.SearchFilters, db: Session = Depends(get_db)):
    # so, type can be location or city or hotel
    print(filters)
    hotels = get_hotels_with_filters(filters, db)
    return hotels