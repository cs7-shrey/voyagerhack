import asyncio
from fastapi import FastAPI
from copilotkit import CopilotKitRemoteEndpoint, Action as CopilotAction
from app.services.tools.get_distance import get_distance
from app.services.cpkit_actions import nearby_places, events
import time
from dotenv import load_dotenv
import os
import httpx
 
load_dotenv()

# Define your backend action



# asyncio.run(get_nearby_places('Spicy Vegetarian Food in Sydney, Australia'))
# this is a dummy action for demonstration purposes

action2 = CopilotAction(
    name="getDistance",
    description="Gets distance between two locations on a map",
    parameters=[
        {
            "name": "location1",
            "type": "string",
            "description": "The first location",
            "required": True,
        },
        {
            "name": "location2",
            "type": "string",
            "description": "The second location",
            "required": True,
        }
    ],
    handler=get_distance
)
 
# Initialize the CopilotKit SDK
sdk = CopilotKitRemoteEndpoint(actions=[nearby_places.action, action2, events.action])