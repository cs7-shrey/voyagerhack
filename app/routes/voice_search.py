from ai import llm
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


load_dotenv()
router = APIRouter(tags=["voice search"])

API_KEY = os.getenv('SPEECHMATICS_API_KEY')
PATH_TO_FILE = "received_audio.wav"
CONNECTION_URL = f"wss://eu2.rt.speechmatics.com/v2"

prev_context_mapping: dict[int, dict] = {}                  # TODO: implement this
        
@router.websocket("/ws/llm/search")
async def llm_response_websocket(ws: WebSocket, current_user: TokenData = Depends(socket_get_current_client), db: Session = Depends(get_db)):
    await ws.accept()
    transcript_queues = queue_maps['search']
    transcript_queues[current_user.user_id] = asyncio.Queue()
    transcript = ''
    # TODO: ADD timeout here
    while not transcript:
        transcript = await transcript_queues[current_user.user_id].get()
    # send the transcription to gemini
    print('gemini ko bhej rahe hai', transcript)
    response = await llm.invoke(transcript)     # set this in the context of next prompt
    filters_dict = llm.parse_llm_response(response.text)
    response = process_llm_filters(filters_dict, SearchFilters, db)
    print('here')
    hotels = response['data']
    response['data'] = [dict(hotel) for hotel in hotels]
    await ws.send_json(response)
    await ws.close()