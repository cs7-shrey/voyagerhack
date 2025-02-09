import asyncio
import copy
import httpx
import io
import json
import logging
import os
from speechmatics.client import WebsocketClient
from speechmatics.exceptions import (
    EndOfTranscriptException,
    ForceEndSession,
    TranscriptionError,
)
from speechmatics.helpers import get_version, json_utf8, read_in_chunks
from speechmatics.models import (
    AudioSettings,
    ClientMessageType,
    ConnectionSettings,
    ServerMessageType,
    TranscriptionConfig,
    UsageMode,
)
from typing import Dict
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse
import websocket
import websockets
import wave
import websockets.asyncio
import websockets.asyncio.client

LOGGER = logging.getLogger(__name__)
class Speech(WebsocketClient):
    def __init__(self, connection_url: str, api_key: str, language_code: str, audio_encoding: str, max_delay: int):
        super().__init__(ConnectionSettings(url=connection_url, auth_token=api_key))
        self.consumer_task = None
        self.producer_task = None
        self.audio_queue = asyncio.Queue()
        self.audio_settings = AudioSettings()
        self.audio_settings.encoding = audio_encoding
        self.transcription_config = TranscriptionConfig(language=language_code, max_delay=max_delay, operating_point='enhanced')
        self.transcript = ""
    
    def setup (self, language_code: str, audio_encoding: str, max_delay: int):
        ...
    async def start(self, from_cli: bool = False, extra_headers: Dict = None):
        audio_settings = self.audio_settings
        transcription_config = self.transcription_config
        if not self.websocket: 
            self.seq_no = 0
            self._language_pack_info = None
            await self._init_synchronization_primitives()
            if extra_headers is None:
                extra_headers = {}
            if (
                not self.connection_settings.generate_temp_token
                and self.connection_settings.auth_token is not None
            ):
                token = f"Bearer {self.connection_settings.auth_token}"
                extra_headers["Authorization"] = token

            if (
                self.connection_settings.generate_temp_token
                and self.connection_settings.auth_token is not None
            ):
                temp_token = await _get_temp_token(self.connection_settings.auth_token)
                token = f"Bearer {temp_token}"
                extra_headers["Authorization"] = token

            url = self.connection_settings.url

            # Extend connection url with sdk version information
            cli = "-cli" if from_cli is True else ""
            version = get_version()
            parsed_url = urlparse(url)

            query_params = dict(parse_qsl(parsed_url.query))
            query_params["sm-sdk"] = f"python{cli}-{version}"
            updated_query = urlencode(query_params)

            url_path = parsed_url.path
            if not url_path.endswith(self.transcription_config.language.strip()):
                if url_path.endswith("/"):
                    url_path += self.transcription_config.language.strip()
                else:
                    url_path += f"/{self.transcription_config.language.strip()}"

            updated_url = urlunparse(
                parsed_url._replace(path=url_path, query=updated_query)
            )
            self.websocket = await websockets.connect(
                updated_url,
                ssl=self.connection_settings.ssl_context,
                ping_timeout=self.connection_settings.ping_timeout_seconds,
                # Don't limit the max. size of incoming messages
                max_size=None,
                additional_headers=extra_headers,
            )
            try:
                start_recognition_msg = self._start_recognition(audio_settings)
            except ForceEndSession:
                return
            await self.websocket.send(start_recognition_msg)
    async def stage(
        self, 
        stream,
        audio_settings: AudioSettings = None,
    ):
        if not self.consumer_task:
            self.consumer_task = asyncio.create_task(self._consumer_handler())
            
        self.producer_task = asyncio.create_task(
            self._producer_handler(stream, audio_settings.chunk_size)
        )
        try:
            await self.producer_task
        except Exception as e:
            print(e)
    
    async def yield_queue_data(self):
        while True:
            indata = await self.audio_queue.get()
            yield indata, None 
            
    async def send_audio_from_queue(self, audio_settings: AudioSettings = None):
        if not audio_settings:
            audio_settings = self.audio_settings
        async for chunk, _ in self.yield_queue_data():
            if chunk is None:  # Signal to stop processing
                break
            try:
                await self.stage(io.BytesIO(chunk), audio_settings)
            except Exception as e:
                print(e)
                break
    
    def save_audio(self, audio_chunk):
        with wave.open("received_audio.wav", "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)    # 16 bit audio (2 bytes)
            wf.setframerate(44100)  # sample rate
            wf.writeframes(audio_chunk)
    async def _producer(self, stream, audio_chunk_size):
        # super()._producer(stream, audio_chunk_size)
        async for audio_chunk in read_in_chunks(stream, audio_chunk_size):
            if self._session_needs_closing:
                break

            if self._transcription_config_needs_update:
                yield self._set_recognition_config()
                self._transcription_config_needs_update = False

            await asyncio.wait_for(
                self._buffer_semaphore.acquire(),
                timeout=self.connection_settings.semaphore_timeout_seconds,
            )
            self.seq_no += 1
            self._call_middleware(ClientMessageType.AddAudio, audio_chunk, True)
            yield audio_chunk
        # yield self._end_of_stream()
        # await self.done()

    def _consumer(self, message):
        """
            Consumes messages and acts on them.

            :param message: Message received from the server.
            :type message: str

            :raises TranscriptionError: on an error message received from the
                server after the Session started.
            :raises EndOfTranscriptException: on EndOfTranscription message.
            :raises ForceEndSession: If this was raised by the user's event
                handler.
        """
        LOGGER.debug(message)
        message = json.loads(message)
        message_type = message["message"]
        if message_type == ServerMessageType.AddTranscript:
            self.transcript += copy.deepcopy(message['metadata']['transcript'])
        for handler in self.event_handlers[message_type]:
            try:
                handler(copy.deepcopy(message))
            except ForceEndSession:
                LOGGER.warning("Session was ended forcefully by an event handler")
                raise
        

        if message_type == ServerMessageType.RecognitionStarted:
            self._flag_recognition_started()
            if "language_pack_info" in message:
                self._set_language_pack_info(message["language_pack_info"])
        elif message_type == ServerMessageType.AudioAdded:
            self._buffer_semaphore.release()
        elif message_type == ServerMessageType.EndOfTranscript:
            raise EndOfTranscriptException()
        elif message_type == ServerMessageType.Warning:
            LOGGER.warning(message["reason"])
        elif message_type == ServerMessageType.Error:
            raise TranscriptionError(message["reason"])
    async def _done(self):
        yield self._end_of_stream()
    
    async def done(self):
        async for message in self._done():
            try:
                await self.websocket.send(message)
            except websockets.exceptions.ConnectionClosedOK:
                # Can occur if a timeout has closed the connection.
                print("Web socket already closed")
                return
            except websockets.exceptions.ConnectionClosedError:
                print("Disconnected while sending a message().")
                return
    async def run(
        self,
        stream,
        transcription_config: TranscriptionConfig = None,
        audio_settings: AudioSettings = None,
        from_cli: bool = False,
        extra_headers: Dict = None,
    ):
        if not audio_settings:
            audio_settings = self.audio_settings
        if not transcription_config:
            transcription_config = self.transcription_config
        """
        Begin a new recognition session.
        This will run asynchronously. Most callers may prefer to use
        :py:meth:`run_synchronously` which will block until the session is
        finished.

        :param stream: File-like object which an audio stream can be read from.
        :type stream: io.IOBase

        :param transcription_config: Configuration for the transcription.
        :type transcription_config: speechmatics.models.TranscriptionConfig

        :param audio_settings: Configuration for the audio stream.
        :type audio_settings: speechmatics.models.AudioSettings

        :param from_cli: Indicates whether the caller is the command-line interface or not.
        :type from_cli: bool

        :raises Exception: Can raise any exception returned by the
            consumer/producer tasks.
        """
        # self.transcription_config = transcription_config
        # self.seq_no = 0
        # self._language_pack_info = None
        # await self._init_synchronization_primitives()
        # if extra_headers is None:
        #     extra_headers = {}
        # if audio_settings is None:
        #     audio_settings = AudioSettings()
        # if (
        #     not self.connection_settings.generate_temp_token
        #     and self.connection_settings.auth_token is not None
        # ):
        #     token = f"Bearer {self.connection_settings.auth_token}"
        #     extra_headers["Authorization"] = token

        # if (
        #     self.connection_settings.generate_temp_token
        #     and self.connection_settings.auth_token is not None
        # ):
        #     temp_token = await _get_temp_token(self.connection_settings.auth_token)
        #     token = f"Bearer {temp_token}"
        #     extra_headers["Authorization"] = token

        # url = self.connection_settings.url

        # # Extend connection url with sdk version information
        # cli = "-cli" if from_cli is True else ""
        # version = get_version()
        # parsed_url = urlparse(url)

        # query_params = dict(parse_qsl(parsed_url.query))
        # query_params["sm-sdk"] = f"python{cli}-{version}"
        # updated_query = urlencode(query_params)

        # url_path = parsed_url.path
        # if not url_path.endswith(self.transcription_config.language.strip()):
        #     if url_path.endswith("/"):
        #         url_path += self.transcription_config.language.strip()
        #     else:
        #         url_path += f"/{self.transcription_config.language.strip()}"

        # updated_url = urlunparse(
        #     parsed_url._replace(path=url_path, query=updated_query)
        # )

        try:
            # async with websockets.connect(  # pylint: disable=no-member
            #     updated_url,
            #     ssl=self.connection_settings.ssl_context,
            #     ping_timeout=self.connection_settings.ping_timeout_seconds,
            #     # Don't limit the max. size of incoming messages
            #     max_size=None,
            #     additional_headers=extra_headers,
            # ) as self.websocket:
            await self._communicate(stream, audio_settings)
        finally:
            self.session_running = False
            self._session_needs_closing = False
            self.websocket = None
            
    async def close(self):
        if self.websocket:
            await self.websocket.close()
    async def _communicate(self, stream, audio_settings):
        """
        Create a producer/consumer for transcription messages and
        communicate with the server.
        Internal method called from _run.
        """
        # try:
        #     start_recognition_msg = self._start_recognition(audio_settings)
        # except ForceEndSession:
        #     return
        # await self.websocket.send(start_recognition_msg)

        # consumer_task = asyncio.create_task(self._consumer_handler())
        # producer_task = asyncio.create_task(
        #     self._producer_handler(stream, audio_settings.chunk_size)
        # )
        
        # (done1, pending1) = await asyncio.wait(
            # [self.producer_task], return_when=asyncio.ALL_COMPLETED
        # )
        try:
            await self.done()
            await self.consumer_task
        except Exception as e:
            print(e)
        finally:
            asyncio.create_task(self.close())

        # (done, pending) = await asyncio.wait(
        #     [self.consumer_task], return_when=asyncio.FIRST_EXCEPTION
        # )

        # # done = done1 | done2
        # # pending = pending1 | pending2
        # # If a task is pending the other one threw an exception, so tidy up
        # for task in pending:
        #     task.cancel()

        # for task in done:
        #     exc = task.exception()
        #     if exc and not isinstance(exc, (EndOfTranscriptException, ForceEndSession)):
        #         raise exc

async def _get_temp_token(api_key):
    """
    Used to get a temporary token from management platform api for SaaS users
    """
    version = get_version()
    mp_api_url = os.getenv("SM_MANAGEMENT_PLATFORM_URL", "https://mp.speechmatics.com")
    endpoint = mp_api_url + "/v1/api_keys"
    params = {"type": "rt", "sm-sdk": f"python-{version}"}
    body = {"ttl": 60}
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    # pylint: disable=no-member
    response = httpx.post(endpoint, json=body, params=params, headers=headers)
    response.raise_for_status()
    response.read()
    key_object = response.json()
    return key_object["key_value"]