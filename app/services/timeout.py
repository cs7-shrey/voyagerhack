import asyncio
from fastapi import WebSocket
from typing import Awaitable, Callable

async def set_timeout(callback: Callable[[], Awaitable[None]], seconds: int):
    await asyncio.sleep(seconds)
    await callback()

async def websocket_timeout(ws: WebSocket, seconds: int):
    await asyncio.sleep(seconds)
    if ws.client_state.name == "CONNECTED":
        await ws.close()
    else:
        print('websocket already closed')