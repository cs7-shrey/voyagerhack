from pydantic import Field
from .main import Tool
from tavily import TavilyClient
import os
import httpx
from dotenv import load_dotenv
load_dotenv()

class SearchAPI(Tool):
    """Searches about any given topic using a search API tool"""
    __fname__ = "search_api"
    __description__ = "Searches about any given topic using a search API tool"
    query: str = Field(..., description="The search query")
    
    
async def search_api(query: str): 
    print('using search api')
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.tavily.com/search",
            json={
                "query": query,
                "api_key": os.getenv("TAVILY_API_KEY"),
                "include_answer": "basic"
            })
        return response.json()
    