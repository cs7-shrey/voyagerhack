from pydantic import BaseModel, Field
from .main import Tool


class SearchAPI(Tool):
    """Searches about any given topic using a search API tool"""
    __fname__ = "search_api"
    __description__ = "Searches about any given topic using a search API tool"
    query: str = Field(..., description="The search query")
    
    
def search_api(query: str): 
    pass