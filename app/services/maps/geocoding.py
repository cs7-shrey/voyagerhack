import asyncio
from dotenv import load_dotenv
import httpx
import os
from typing import TypedDict

load_dotenv()

class Coordinate(TypedDict):
    latitude: float
    longitude: float

async def geocode_place_id(place_id: str) -> Coordinate:
    if not place_id:
        return
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://maps.googleapis.com/maps/api/geocode/json?place_id={place_id}&key={os.getenv('MAPS_API_KEY')}")
        if response.status_code != 200:
            return
    try:
        api_data = response.json()
    except Exception as e:
        print('exception in geocoding api response', e)
        return
    if not api_data['results']:
        return
    try:
        location = api_data['results'][0]['geometry']['location']
        return {
            'latitude': location['lat'],
            'longitude': location['lng']
        }
    except Exception as e:
        print('could not get location details from geocoding api resopnse', e)
        return

async def main():
   temp_location = await geocode_place_id('ChIJ-7F1mVvjDDkRKrLzXiafoGk') 
   print(temp_location)

if __name__ == '__main__':
    asyncio.run(main())