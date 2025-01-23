from ai import llm
import asyncio
from app.oauth2 import socket_get_current_client
from app.database import get_db
from app.services.filters_processing import process_llm_filters
from app.services.speech import Speech   
from app.schemas import TokenData, SearchFilters, HotelSearchResponse, VoiceSearchResponse, Status
from dotenv import load_dotenv
from fastapi import APIRouter, WebSocket, Depends
import io
import os
import speechmatics
from sqlalchemy.orm import Session
import time
import wave


load_dotenv()
router = APIRouter(prefix="/hotel", tags=["hotel"])

API_KEY = os.getenv('SPEECHMATICS_API_KEY')
PATH_TO_FILE = "received_audio.wav"
CONNECTION_URL = f"wss://eu2.rt.speechmatics.com/v2"

user_transcription_mapping: dict[int, asyncio.Queue] = {}
prev_context_mapping: dict[int, dict] = {}                  # TODO: implement this
@router.websocket("/ws/audio/{language}")
async def audio_websocket(ws: WebSocket, language: str, current_user: TokenData = Depends(socket_get_current_client)):
    await ws.accept()
    print(current_user.user_id)
    audio_data = b""
    print('ws connection established')
    
    """ Speech to text web socket configuration """
    ws_speech = Speech(connection_url=CONNECTION_URL, api_key=API_KEY, language_code=language, audio_encoding='pcm_s16le', max_delay=2)
    def print_transcript(msg):
        print(f"[   FULL] {msg['metadata']['transcript']}")
    ws_speech.add_event_handler(
        event_name=speechmatics.models.ServerMessageType.AddTranscript,
        event_handler=print_transcript,
    )
    # <----------------------------------------------------------------------------------------->
    await ws_speech.start()
    send_task = asyncio.create_task(ws_speech.send_audio_from_queue())
    await ws.send_text('speak')
    print(ws.client_state.name)
    # asyncio.create_task(websocket_timeout(ws, 20))
    start_time = time.time()
    try:
        print('started')
        async for message in ws.iter_bytes():
            audio_data += message
            # print('got data')
            if time.time() - start_time > 20: 
                break
            await ws_speech.audio_queue.put(message)
        await ws_speech.audio_queue.put(None)
        with wave.open("received_audio.wav", "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(44100)
            wf.writeframes(audio_data)
        t1 = time.time()
        await send_task
        print('itna to hogya')
        await ws_speech.run(io.BytesIO(audio_data))
        t2 = time.time()
        print(f'transcription took {t2-t1} seconds')
        print("final transcript", ws_speech.transcript)
        # assuming the queue already exists. to be managed by the frontend. shift this to redis
        await user_transcription_mapping[current_user.user_id].put(ws_speech.transcript)
        print('data inserted in queue')
        # await ws.send_text('done')
    except Exception as e:
        print(e)
        
@router.websocket("/ws/llm")
async def llm_response_websocket(ws: WebSocket, current_user: TokenData = Depends(socket_get_current_client), db: Session = Depends(get_db)):
    await ws.accept()
    user_transcription_mapping[current_user.user_id] = asyncio.Queue()
    # gather the transcription from queue
    transcript = ''
    # TODO: ADD timeout here
    while not transcript:
        transcript = await user_transcription_mapping[current_user.user_id].get()
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