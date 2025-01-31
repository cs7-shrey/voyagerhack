from fastapi import WebSocket, APIRouter, Depends, Query
from app.services.speech import Speech
from app.schemas import TokenData
from app.oauth2 import socket_get_current_client
import asyncio
import time
import io
import os
from dotenv import load_dotenv
import speechmatics
from app.services.queues import queue_maps
from app.services.timeout import websocket_timeout

load_dotenv()

API_KEY = os.getenv('SPEECHMATICS_API_KEY')
PATH_TO_FILE = "received_audio.wav"
CONNECTION_URL = f"wss://eu2.rt.speechmatics.com/v2"

router = APIRouter(tags=["voice websocket"])

@router.websocket("/ws/audio/{language}")
async def audio_websocket(ws: WebSocket, language: str, service: str = Query(...), current_user: TokenData = Depends(socket_get_current_client)):
    await ws.accept()
    audio_data = b""
    
    """ Speech to text web socket configuration """
    ws_speech = Speech(connection_url=CONNECTION_URL, api_key=API_KEY, language_code=language, audio_encoding='pcm_s16le', max_delay=2)
    def print_transcript(msg):
        print(f"[   FULL] {msg['metadata']['transcript']}")
    ws_speech.add_event_handler(
        event_name=speechmatics.models.ServerMessageType.AddTranscript,
        event_handler=print_transcript,
    )

    await ws_speech.start()
    send_task = asyncio.create_task(ws_speech.send_audio_from_queue())
    # await ws.send_text('speak')
    # asyncio.create_task(websocket_timeout(ws, 20))
    current_time = time.time()
    try:
        print('started')
        async for message in ws.iter_bytes():
            if time.time() - current_time > 20:
                break
            audio_data += message
            await ws_speech.audio_queue.put(message)
        await ws_speech.audio_queue.put(None)
        t1 = time.time()
        await send_task
        print('itna to hogya')
        await ws_speech.run(io.BytesIO(audio_data))
        t2 = time.time()
        print(f'transcription took {t2-t1} seconds')
        # shift this to redis
        if not current_user.user_id in queue_maps[service]:
            return
        await queue_maps[service][current_user.user_id].put(ws_speech.transcript)
        print('data inserted in queue')
    except Exception as e:
        print(e)