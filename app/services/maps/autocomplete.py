import asyncio
import httpx
from dotenv import load_dotenv
import os

load_dotenv()

# TODO: add location limiter (provided by the API)
async def place_autocomplete(input: str) -> str:
    if not input:
        return ''
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://maps.googleapis.com/maps/api/place/autocomplete/json?input={input}&key={os.getenv('MAPS_API_KEY')}")
        if response.status_code != 200:
            return ''
        try:
            api_data = response.json()
        except Exception as e:
            print("couldn't convert google maps auto complete api response to json")
            return ''
        if not 'predictions' in api_data or not api_data['predictions']:
            return ''
        
        strongest_match = api_data['predictions'][0]
        print(strongest_match['description'])
        if not 'place_id' in strongest_match:
            return ''
        return strongest_match['place_id']

    
async def main():
    place_id = await place_autocomplete("akshardham")
    print(place_id)

if __name__ == '__main__':
    asyncio.run(main())