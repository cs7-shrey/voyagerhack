from app.services.ai import llm
import asyncio
from app.oauth2 import socket_get_current_client
from app.database import get_db
from app.services.filters_processing import process_llm_filters
from app.schemas import TokenData, SearchFilters
from dotenv import load_dotenv
from fastapi import APIRouter, WebSocket, Depends
import os
from sqlalchemy.orm import Session
from app.services.queues import queue_maps
from app.services.timeout import websocket_timeout


load_dotenv()
router = APIRouter(tags=["voice search"])

API_KEY = os.getenv('SPEECHMATICS_API_KEY')
PATH_TO_FILE = "received_audio.wav"
CONNECTION_URL = f"wss://eu2.rt.speechmatics.com/v2"

        
@router.websocket("/ws/llm/search")
async def llm_response_websocket(ws: WebSocket, current_user: TokenData = Depends(socket_get_current_client), db: Session = Depends(get_db)):
    await ws.accept()
    asyncio.create_task(websocket_timeout(ws, 40))
    json_data = await ws.receive_json()
    previous_filters = json_data['previous_filters']
    previous_ai_message = json_data['previous_message']
    print(previous_ai_message)
    transcript_queues = queue_maps['search']
    transcript_queues[current_user.user_id] = asyncio.Queue()
    transcript = ''
    while not transcript:
        transcript = await transcript_queues[current_user.user_id].get()
    print('sending to gemini...', transcript)
    response = await llm.invoke(transcript, previous_filters, previous_ai_message)     
    filters_dict = llm.parse_llm_response(response.text)
    response = process_llm_filters(filters_dict, SearchFilters, db)
    hotels = response['data']
    response['data'] = [dict(hotel) for hotel in hotels]
    await ws.send_json(response)
    await ws.close()