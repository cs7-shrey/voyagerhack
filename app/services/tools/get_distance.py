import asyncio
from typing import Optional
from pydantic import BaseModel, Field
import httpx
import os
from dotenv import load_dotenv
# from .main import Tool

load_dotenv()
class GetDistance(BaseModel):
    """Gets distance between two locations on a map"""
    __fname__ = "get_distance"
    __description__ = "Gets distance between two locations on a map"
    location1: str = Field(..., description="The first location")
    location2: str = Field(..., description="The second location")
    
async def get_distance(location1: str, location2: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://maps.googleapis.com/maps/api/distancematrix/json?origins={location1}&destinations={location2}&key={os.getenv('MAPS_API_KEY')}")
        try: 
            if response.status_code != 200:
                return {'status': 'error', 'error': "An error occured"}
            return response.json()
        except Exception as e:
            print(e)
            return {'status': 'error', 'error': "An error occured"}

async def main():
    response = await get_distance("Svelte Delhi, a Member Of Radisson Individuals, Saket, Delhi", "IIT Delhi")
    print(response)
    
if __name__ == "__main__":
    asyncio.run(main())

 