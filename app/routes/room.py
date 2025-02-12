from app.services.crud.room import get_room_info_by_id, get_rate_plan_by_plan_id
from app.database import get_db
from fastapi import APIRouter, Depends

router = APIRouter(prefix='/room', tags=['Room'])

@router.get('/{room_type_id}')  # TODO: add response model here
def get_room_info(room_type_id: int, db = Depends(get_db)):
    return get_room_info_by_id(db, room_type_id)

@router.get('/rate_plan/{rate_plan_id}')
def get_rate_plan_info(rate_plan_id: int, db = Depends(get_db)):
    return get_rate_plan_by_plan_id(db, rate_plan_id)