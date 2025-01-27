import httpx
from dotenv import load_dotenv
import os
from .main import Tool
from pydantic import Field
import asyncio

load_dotenv()

class NearbyPlaces(Tool):
    """Gets neaby places such as restaurants, gas stations, clubs, banks, etc. near a particular location using Google's places API"""
    query: str = Field(..., description="The query to be send to google maps. Ex. nearby restaurants near Novotel, New Delhi")
    
async def get_nearby_places(query: str):
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": os.getenv("MAPS_API_KEY") ,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.priceLevel,places.googleMapsUri",
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
            # print(response.json())
            places = response.json()['places']
            with open('places.json', 'w') as f:
                f.write(response.text)
            print(len(places))
            demo = list(map(lambda x: {'name': x['displayName']['text']}, places))
            print(demo)
            places_formatted = list(map(lambda x: {'name': x['displayName']['text'], 'address': x['formattedAddress'], 'google_maps_url': x['googleMapsUri']}, places))
            print(places_formatted)
            return places_formatted
        except Exception as e:
            print("An error occured in the places API", e)
            return "Error, could not get nearby places"
        
 
