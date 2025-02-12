import asyncio
from copilotkit import Action as CopilotAction
from dotenv import load_dotenv
import httpx
import os
import time


load_dotenv()

async def set_place_photo_url(place: dict, name: str):
    imageURL = ''
    if not name:
        place['imageURL'] = imageURL
        return
    params = {
        'maxHeightPx': 300,
        'skipHttpRedirect': True,
        'key': os.getenv('MAPS_API_KEY')
    }
    full_name = name.strip('/') if name.endswith('/media') else name.strip('/') + '/media'
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://places.googleapis.com/v1/{full_name}", params=params)
        if response.status_code >= 400:
            print('error while getting image', response.status_code)
            print(response.text)        
        try: 
            imageURL = response.json()['photoUri']
            print(imageURL)
        except Exception as e:
            print('error getting image', e)
    place['imageURL'] = imageURL

async def get_nearby_places(query: str):
    print(query)
    print('nearby places called')
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": os.getenv("MAPS_API_KEY") ,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.priceLevel,places.googleMapsUri,places.shortFormattedAddress,places.primaryTypeDisplayName,places.photos",
    }
    async with httpx.AsyncClient() as client:
        response = await client.post("https://places.googleapis.com/v1/places:searchText", json={
          "textQuery": query 
        }, headers=headers)
        if response.status_code != 200:
            print('error while fetching nearby places', response.status_code)
            print(response.text)
            return "Error, could not get nearby places"
        try:
            places = response.json()['places']
            limit_places = 5 if len(places) > 5 else len(places)
            places_formatted = []
            tasks = []
            for place in places[:limit_places]:
                name = place['displayName']['text']
                address = place['shortFormattedAddress']
                googleMapsLink = place['googleMapsUri']
                type = place['primaryTypeDisplayName']['text'] if 'primaryTypeDisplayName' in place else ''
                photo_name = place['photos'][0]['name'] if ('photos' in place and len(place['photos']) > 0) else ''
                start = time.time()
                # imageURL = await get_place_photo_url(photo_name)
                formatted_place = {
                    'name': name,
                    'address': address,
                    'googleMapsLink': googleMapsLink,
                    'type': type,
                }
                places_formatted.append(formatted_place)
                tasks.append(asyncio.create_task(set_place_photo_url(places_formatted[-1], photo_name)))
            await asyncio.wait_for(asyncio.gather(*tasks), timeout=10)
            print(places_formatted[0])
            return places_formatted
        except Exception as e:
            print("An error occured in the places API", e)
            return "Error, could not get nearby places"
        
action = CopilotAction(
    name="nearbyPlaces",
    description="Gets neaby places such as restaurants, gas stations, clubs, banks, etc. near a particular location using Google's places API",
    parameters=[
        {
            "name": "query",
            "type": "string",
            "description": "The query to be send to google maps. Ex. nearby restaurants near Novotel, New Delhi",
            "required": True,
        }
    ],
    handler=get_nearby_places
)