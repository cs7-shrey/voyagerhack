from fastapi import APIRouter, Depends, WebSocket, Query, WebSocketDisconnect, WebSocketException, HTTPException
from app.database import get_db
from app.schemas import HotelRoomResponse, HotelInfoResponse, ChatMode, BookHotelSchema, TokenData
from sqlalchemy.orm import Session
from app.oauth2 import get_current_client, socket_get_current_client
from app.services.crud.hotel.info import get_hotel_info_by_id, get_hotel_room_info
from app.services.crud.room import check_booking_detail_validity
from app.services.crud.booking import book_hotel
from app.services.hotel_info_agent import HotelChatAgent
from app.services.queues import queue_maps
import asyncio
router = APIRouter(prefix="/hotel", tags=["hotel"])

@router.get("/{id}", response_model=HotelInfoResponse)
async def get_hotel_data(id: int, db: Session = Depends(get_db), current_user: TokenData = Depends(get_current_client)):
    try:
        return get_hotel_info_by_id(id, db)
    except Exception as e:
        print(e)

@router.get("/{id}/rooms", response_model=list[HotelRoomResponse])
async def get_hotel_rooms(id: int, db: Session = Depends(get_db), current_user: TokenData = Depends(get_current_client)):
    try:
        return get_hotel_room_info(id, db)
    except Exception as e:
        print(e)
        
@router.post('/book')
async def book_hotel_route(booking_details: BookHotelSchema, db: Session = Depends(get_db), current_user: TokenData = Depends(get_current_client)):
    # checking details
    res = check_booking_detail_validity(db, int(booking_details.hotel_id), booking_details.room_type_id, booking_details.rate_plan_id)
    print('yele', res)
    if not res:
        raise HTTPException(status_code=400, detail="Invalid booking details")
    # book the hotel 
    booking = book_hotel(db, current_user.user_id, booking_details)
    if not booking:
        raise HTTPException(status_code=400, detail="Booking failed")
    return {"message": "Booking successful"}

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
    agent = HotelChatAgent(hotel_name=hotel_name, location=hotel_location, hotel_info=json_data['hotel_info'])
    while True:
        try:
            mode = await ws.receive_text()
            print(mode)
            print(mode == ChatMode.text)
            if mode == ChatMode.text:
                message = await ws.receive_text()
                response = await agent.talk(message)
                await ws.send_text(response)
            elif mode == ChatMode.voice:
                # create a queue and await for transcript
                transcript_queue = queue_maps['chat']
                transcript_queue[current_user.user_id] = asyncio.Queue()
                print('queue created')
                transcript = ''
                while not transcript:
                    transcript = await transcript_queue[current_user.user_id].get()
                reponse = await agent.talk(transcript)
                await ws.send_text(reponse)
        except WebSocketDisconnect:
            print('chat ws disconnected') 
            return
        except WebSocketException:
            print("an error occured in web socket")
            return
        