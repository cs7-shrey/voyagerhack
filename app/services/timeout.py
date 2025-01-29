from fastapi import WebSocket, WebSocketDisconnect
from contextlib import suppress
import logging
import asyncio

logger = logging.getLogger(__name__)

async def websocket_timeout(ws: WebSocket, seconds: int):
    try:
        await asyncio.sleep(seconds)
        # Check if websocket is still open before trying to close
        if ws.client_state.name == "CONNECTED":
            await ws.close(code=1000, reason="Connection timeout")
            logger.info("WebSocket closed due to timeout")
    except WebSocketDisconnect:
        # WebSocket already closed by client
        logger.info("WebSocket already disconnected")
        pass
    except asyncio.CancelledError:
        # handle cancellation
        with suppress(WebSocketDisconnect, Exception):
            if ws.client_state.name == "CONNECTED":
                await ws.close(code=1000, reason="Operation cancelled")
                logger.info("WebSocket closed due to cancellation")
    except Exception as e:
        logger.error(f"Error in websocket timeout: {e}")
        with suppress(WebSocketDisconnect, Exception):
            if ws.client_state.name == "CONNECTED":
                await ws.close(code=1011, reason="Internal error")