from pydantic import BaseModel, Field
from .main import Tool
from tavily import TavilyClient
import os
from dotenv import load_dotenv
load_dotenv()

class SearchAPI(Tool):
    """Searches about any given topic using a search API tool"""
    __fname__ = "search_api"
    __description__ = "Searches about any given topic using a search API tool"
    query: str = Field(..., description="The search query")
    
    
def search_api(query: str): 
    client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
    response = client.search(query)
    pass