import datetime
from enum import Enum
from pydantic import BaseModel
from typing import Optional

# the decoded token data that is used to the current user
class TokenData(BaseModel):
    user_id: int
    
class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    
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

class HotelInfoResponse(BaseModel):
    id: int
    gi_id: int
    name: str
    location: str
    hotel_star: int
    user_rating: float = 0
    user_rating_count: int
    property_type: str
    images: list[str]
    amenities: list[str]
    
class Beds(BaseModel):
    type: str
    count: int  
    bedTypeKey: Optional[str] = None # TODO: CHANGE THIS LATER

class RatePlan(BaseModel):
    plan_id: int
    pay_mode: str
    base_fare: float
    total_discount: float
    taxes: float
    filter_code: list[str]
class HotelRoomResponse(BaseModel):
    room_type_id: int
    room_type_name: str
    room_photos: list[str]
    max_guests: int
    max_adults: int
    max_children: int
    beds: Optional[list[Beds]] = []
    display_amenities: list[str]
    rate_plans: list[RatePlan]
    
class Beds(BaseModel):
    type: str
    count: int  
    bedTypeKey: Optional[str] = None # TODO: CHANGE THIS LATER
    
class Place(BaseModel):
    name: str
    type: str

class SearchFilters(BaseModel):
    place: Place
    check_in: Optional[str] = (datetime.date.today() + datetime.timedelta(days=1)).strftime('%Y-%m-%d')
    check_out: Optional[str] = (datetime.date.today() + datetime.timedelta(days=2)).strftime('%Y-%m-%d')
    min_budget: Optional[int] = 0
    max_budget: Optional[int] = 50000
    hotel_star: list[int] = [0,1,2,3,4,5]
    user_rating: Optional[float] = 0  
    property_type: Optional[list[str]] = []
    hotel_amenity_codes: Optional[list[str]] = []
    room_amenity_codes: Optional[list[str]] = []

class Status(BaseModel):
    code: int
    message: str
class VoiceSearchResponse(BaseModel):
    status: Status
    filters: SearchFilters
    data: list[HotelSearchResponse]

class ChatMode(str, Enum):
    voice = "voice"
    text = "text"

class Constants(BaseModel):
    name: str
    code: Optional[str] = ''