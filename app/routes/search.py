from fastapi import FastAPI, APIRouter, Depends
from ..utils.search_suggestions import get_suggestions
from .. import schemas, models
from ..database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/suggestions/", response_model=list[schemas.SearchSuggestion]) 
def search_suggestions(search_term: str):
    results = get_suggestions(search_term)
    return results

@router.get("/hotels", response_model=list[schemas.HotelSearchResponse])
def get_hotels(search_term: str, type: str, db: Session = Depends(get_db)):
    # so, type can be location or city or hotel
    type_to_column = {
        "location": models.Hotel.location,
        "city": models.City.name,
        "hotel": models.Hotel.name
    }
    results = db.query(models.Hotel).join(models.City, models.Hotel.city_id == models.City.city_id).filter(type_to_column[type] == search_term).limit(10).all()
    return results