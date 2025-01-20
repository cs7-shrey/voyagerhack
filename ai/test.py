# from websocket import WebSocketApp
# import os
# from dotenv import load_dotenv

# load_dotenv();

# def on_open(ws):
#     print('Opening Websocket connection to the server ... ')
    
# def on_message(ws, message):
#     print('message received')
#     print(message)


    
# ws = WebSocketApp("wss://eu2.rt.speechmatics.com/v2", header={
#     "Authorization": f"Bearer {os.getenv('SPEECHMATICS_API_KEY')}"
# }, on_open=on_open) 
# ws.send('hello');

# ws.run_forever()

import speechmatics
from httpx import HTTPStatusError
import os 
import dotenv
from speechmatics.models import ConnectionSettings
from speechmatics.batch_client import BatchClient
import time
import datetime
dotenv.load_dotenv()

API_KEY = os.getenv('SPEECHMATICS_API_KEY')
PATH_TO_FILE = "received_audio.wav"
LANGUAGE = "en"
def realtime_transcription():
    
    CONNECTION_URL = f"wss://eu2.rt.speechmatics.com/v2"
    
    # Create a transcription client
    ws = speechmatics.client.WebsocketClient(
        speechmatics.models.ConnectionSettings(
            url=CONNECTION_URL,
            auth_token=API_KEY,
        )
    )
    
    # Define an event handler to print the partial transcript
    def print_partial_transcript(msg):
        print(f"[partial] {msg['metadata']['transcript']}")
    
    # Define an event handler to print the full transcript
    def print_transcript(msg):
        print(f"[   FULL] {msg['metadata']['transcript']}")
    
    # Register the event handler for partial transcript
    ws.add_event_handler(
        event_name=speechmatics.models.ServerMessageType.AddPartialTranscript,
        event_handler=print_partial_transcript,
    )
    
    # Register the event handler for full transcript
    ws.add_event_handler(
        event_name=speechmatics.models.ServerMessageType.AddTranscript,
        event_handler=print_transcript,
    )
    
    settings = speechmatics.models.AudioSettings()
    
    # Define transcription parameters
    # Full list of parameters described here: https://speechmatics.github.io/speechmatics-python/models
    conf = speechmatics.models.TranscriptionConfig(
        language=LANGUAGE,
        # enable_partials=True,
        max_delay=2,
    )
    
    print("Starting transcription (type Ctrl-C to stop):")
    with open(PATH_TO_FILE, 'rb') as fd:
        try:
            ws.run_synchronously(fd, conf, settings)
        except KeyboardInterrupt:
            print("\nTranscription stopped.")
        except HTTPStatusError as e:
            if e.response.status_code == 401:
                print('Invalid API key - Check your API_KEY at the top of the code!')
            else:
                raise e

def batch_transcription():
    settings = ConnectionSettings(
        url="https://asr.api.speechmatics.com/v2",
        auth_token=API_KEY,
    )
    # Define transcription parameters
    conf = {
        "type": "transcription",
        "transcription_config": {
            "language": LANGUAGE
        }
    }

    # Open the client using a context manager
    with BatchClient(settings) as client:
        try:
            job_id = client.submit_job(
                audio=PATH_TO_FILE,
                transcription_config=conf,
            )
            print(f'job {job_id} submitted successfully, waiting for transcript')

            # Note that in production, you should set up notifications instead of polling.
            # Notifications are described here: https://docs.speechmatics.com/features-other/notifications
            transcript = client.wait_for_completion(job_id, transcription_format='txt')
            # To see the full output, try setting transcription_format='json-v2'.
            print(transcript)
        except HTTPStatusError as e:
            if e.response.status_code == 401:
                print('Invalid API key - Check your API_KEY at the top of the code!')
            elif e.response.status_code == 400:
                print(e.response.json()['detail'])
            else:
                raise e
    
if __name__ == "__main__":
    start = time.time()
    realtime_transcription()
    end = time.time()
    print(f'realtime_transcription took {end-start} seconds')
    # batch_transcription()
    
    