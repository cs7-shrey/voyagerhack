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
    print(query)
    print('nearby places called')
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": os.getenv("MAPS_API_KEY") ,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.priceLevel,places.googleMapsUri,places.shortFormattedAddress,places.primaryTypeDisplayName",
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
            places_formatted = list(map(lambda x: {'name': x['displayName']['text'], 'address': x['shortFormattedAddress'], 'google_maps_url': x['googleMapsUri'], 'type': x.get('primaryTypeDisplayName')}, places))
            print(places_formatted[0])
            return places_formatted[:5] if len(places_formatted) > 5 else places_formatted
        except Exception as e:
            print("An error occured in the places API", e)
            return "Error, could not get nearby places"
        
 
