from pydantic import BaseModel, Field
from .main import Tool


class GetHotelInfo(Tool):
    """Get all the information present about the hotel in the database"""
    __fname__ = "get_hotel_info"
    __description__ = "Gets all the information present about the hotel in the database"
    
def get_hotel_info():
    pass
