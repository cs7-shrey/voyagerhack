from fastapi import APIRouter, Depends, HTTPException, status
from app.database import get_db
from app.schemas import HotelRoomResponse, HotelInfoResponse
from sqlalchemy.orm import Session
from app.oauth2 import get_current_client
from app.services.crud.hotel import get_hotel_info_by_id, get_hotel_room_info

router = APIRouter(prefix="/hotel", tags=["hotel"])

@router.get("/{id}", response_model=HotelInfoResponse)
async def get_hotel_data(id: int, db: Session = Depends(get_db), current_user: int = Depends(get_current_client)):
    return get_hotel_info_by_id(id, db)

@router.get("/{id}/rooms", response_model=list[HotelRoomResponse])
async def get_hotel_rooms(id: int, db: Session = Depends(get_db), current_user: int = Depends(get_current_client)):
    return get_hotel_room_info(id, db)