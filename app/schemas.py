from pydantic import BaseModel

class SearchSuggestion(BaseModel):
    label: str
    sublabel: str
    type: str
    score: float

class HotelSearchResponse(BaseModel):
    id: int
    name: str
    location: str
    price: float = 0.0
    star_rating: int
    user_rating: float = 0
    user_rating_count: int
    images: list[str]