import asyncio
from copilotkit import Action as CopilotAction
from dotenv import load_dotenv
import httpx
import os
from typing import TypedDict
from tavily import AsyncTavilyClient    

class Location(TypedDict):
    lat: float
    lng: float

class Event(TypedDict):
    title: str
    category: str
    start_datetime: str
    end_datetime: str
    address: str
    labels: list
    location: str

load_dotenv()
async def get_coordinates(place: str) -> Location:
    maps_api_key = os.getenv("MAPS_API_KEY")
    if not maps_api_key:
        raise ValueError("MAPS_API_KEY is not set in environment variables")

    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {"address": place, "key": maps_api_key}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            location = data["results"][0]["geometry"]["location"]
            print(f"Coordinates of {place}:", location)
            return location
        except Exception as error:
            print("Error fetching coordinates:", error)
            return None
    
async def get_events_base(location: Location, start_date: str, offset: int = 0):
    predicthq_key = os.getenv('PREDICT_HQ_API_KEY')
    if not predicthq_key:
        raise ValueError("PREDICT_HQ API key is not set in environment variables")
    print(predicthq_key)
    url = "HTTPS://api.predicthq.com/v1/events/"
    headers = {"Authorization": f"Bearer {predicthq_key}"}
    params = {
        "category": "concerts,conferences,festivals,performing-arts,expos",
        "brand_unsafe.exclude": "true",
        "limit": 10,
        "location_around.origin": f"{location['lat']},{location['lng']}",
        "location_around.offset": "10km",
        "offset": offset,
        "relevance": "location_around,rank",
        "rank": "3,4,5",    
        "start.gte": start_date,
        "state": "active",
        "within": f"50km@{location['lat']},{location['lng']}"
    }

    async with httpx.AsyncClient(follow_redirects=True) as client:
        try:
            response = await client.get(url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()

            results = [
                {
                    "title": event["title"],
                    "category": event.get("category", "general"),
                    "start_datetime": event.get("start_local", "2025-03-30"),
                    "end_datetime": event.get("end_local"),
                    "address": event.get("geo", {}).get("address", {}).get("formatted_address", "Please refer to the listed URLs"),
                    "labels": event.get("labels"),
                    "location": event.get("geo", {}).get("address", {}).get("region")
                }
                for event in data.get("results", [])
            ]

            return results
        except Exception as error:
            print("Error fetching events:", error)
            
async def populate_event_tavily(event: Event):
    client = AsyncTavilyClient(api_key=os.getenv('TAVILY_API_KEY'))
    if not event.get('title') or not (event.get('address') or event.get('location')):
        return event
    query = f"Upcoming event {event['title']} at {event['address'] or event['location']} in english"
    try:
        response = await client.search(query, search_depth='basic', include_images=True, include_answer='basic')
        event['description'] = response['answer']
        event['infoURL'] = response.get('results')[0].get('url')
        event['imageURL'] = response.get('images')[0]
    except Exception as e:
        print(e)
# Usage example:
# import asyncio
# location = {"lat": 40.7128, "lng": -74.0060}  # Example for New York
# events = asyncio.run(get_events(location))
# print(events)

async def get_events_full(place: str, start_date: str, offset: int = 0):
    print('A')
    coordinates = await get_coordinates(place)
    events = await get_events_base(coordinates, start_date, offset)
    tasks = []
    for event in events:
        tasks.append(asyncio.create_task(populate_event_tavily(event)))
    await asyncio.wait_for(asyncio.gather(*tasks), timeout=15)
    print('B')
    print(events)
    return events  

action = CopilotAction(
   name='getEvents',
   description='Gets events happening around a place/location and after a given date',
   parameters=[
       {
              'name': 'place',
              'description': 'The place/location to search for events around',
              'type': 'string',
              'required': True
         },
         {
              'name': 'start_date',
              'description': 'The date from which to search for events',
              'type': 'string',
              'required': True
         },
         {
              'name': 'offset',
              'description': 'The number of events to skip used for pagination',
              'type': 'integer',
              'required': False
       }
   ],
   handler=get_events_full 
)

async def main():
    events = await get_events_full("Radisson Blu Hotel, Dwarka, New Delhi", "2025-02-28", 10)
    print(events[0])
    for event in events:
        print(event['imageURL'])

if __name__ == "__main__":
    asyncio.run(main())
