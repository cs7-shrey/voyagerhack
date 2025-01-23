from typing import Optional
from pydantic import BaseModel, Field
from .main import Tool
class GetDistance(Tool):
    """Gets distance between two locations on a map"""
    __fname__ = "get_distance"
    __description__ = "Gets distance between two locations on a map"
    location1: str = Field(..., description="The first location")
    location2: str = Field(..., description="The second location")
    
def get_distance(location1: str, location2: str):
    pass

required = []

print(GetDistance.__fname__)

 