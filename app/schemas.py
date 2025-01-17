from pydantic import BaseModel
from typing import Optional

class SearchSuggestion(BaseModel):
    label: str
    sublabel: str
    type: str
    score: float

class HotelSearchResponse(BaseModel):
    id: int
    name: str
    location: str
    base_fare: float = 0.0
    hotel_star: int
    user_rating: float = 0
    user_rating_count: int
    images: list[str]
    
class Place(BaseModel):
    name: str
    type: str

class SearchFilters(BaseModel):
    place: Place
    check_in: str
    check_out: str
    min_budget: int = 0
    max_budget: int = 50000
    hotel_star: list[int] = [0,1,2,3,4,5]
    user_rating: float = 0  
    property_type: list[str] = []
    hotel_amenity_codes: Optional[list[str]] = []
    room_amenity_codes: Optional[list[str]] = []

class Constants(BaseModel):
    name: str
    code: Optional[str] = ''