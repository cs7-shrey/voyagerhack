from fastapi import APIRouter, Depends, WebSocket, Query, WebSocketDisconnect, WebSocketException
from app.database import get_db
from app.schemas import HotelRoomResponse, HotelInfoResponse, ChatMode
from sqlalchemy.orm import Session
from app.oauth2 import get_current_client, socket_get_current_client
from app.services.crud.hotel.info import get_hotel_info_by_id, get_hotel_room_info
from app.services.hotel_info_bot import HotelInfoBot

router = APIRouter(prefix="/hotel", tags=["hotel"])

@router.get("/{id}", response_model=HotelInfoResponse)
async def get_hotel_data(id: int, db: Session = Depends(get_db), current_user: int = Depends(get_current_client)):
    return get_hotel_info_by_id(id, db)

@router.get("/{id}/rooms", response_model=list[HotelRoomResponse])
async def get_hotel_rooms(id: int, db: Session = Depends(get_db), current_user: int = Depends(get_current_client)):
    return get_hotel_room_info(id, db)

@router.websocket("/{id}/ws/chat")
async def hotel_chat(
    ws: WebSocket, 
    id: int, 
    mode: ChatMode = Query(...), 
    hotel_name: str = Query(...), 
    hotel_location: str = Query(...), 
    db: Session = Depends(get_db), 
    current_user: int = Depends(socket_get_current_client)
):
    await ws.accept()
    json_data = await ws.receive_json()
    print(hotel_name, hotel_location)
    # get the prompt
    if mode is ChatMode.text:
        message = await ws.receive_text()
        agent = HotelInfoBot(hotel_name=hotel_name, location=hotel_location, hotel_info=json_data['hotel_info'])
        response = await agent.talk(message)
        await ws.send_text(response)
    elif mode is ChatMode.voice:
        ...
    await ws.close()
    # send it to the hotel_info_bot
    # get the llm's response
    # return the response
    # close the websocket

@router.websocket("/exp/{id}/ws/chat")  
async def hotel_chat_ws(
    ws: WebSocket, 
    id: int, 
    hotel_name: str = Query(...), 
    hotel_location: str = Query(...), 
    current_user: int = Depends(socket_get_current_client)
):
    await ws.accept()
    json_data = await ws.receive_json()
    agent = HotelInfoBot(hotel_name=hotel_name, location=hotel_location, hotel_info=json_data['hotel_info'])
    while True:
        try:
            mode = await ws.receive_text()
            print(mode)
            print(mode == ChatMode.text)
            if mode == ChatMode.text:
                print('idhar aagye')
                message = await ws.receive_text()
                response = await agent.talk(message)
                await ws.send_text(response)
            elif mode is ChatMode.voice:
                ...
        except WebSocketDisconnect:
            print('chat ws disconnected') 
            return
        except WebSocketException:
            print("an error occured in web socket")
            return
        