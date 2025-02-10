from sqlalchemy.orm import Session
from app.models import RoomType, RatePlan, Hotel
from sqlalchemy import select, and_

def get_room_info_by_id(db: Session, room_type_id: int):
    query = (
        select(
            RoomType.room_type_id,
            RoomType.room_type_name, 
            RoomType.room_photos,
            RoomType.max_adults,
        )
        .where(RoomType.room_type_id == room_type_id)
    )
    result =  db.execute(query).mappings().one()
    return result
    
def get_rate_plan_by_plan_id(db: Session, rate_plan_id: int):
    query = (
        select(
            RatePlan.plan_id,
            RatePlan.pay_mode,
            RatePlan.base_fare,
            RatePlan.total_discount,
            RatePlan.taxes,
            RatePlan.filter_code
        )
        .where(RatePlan.plan_id == rate_plan_id)
    )
    result = db.execute(query).mappings().one()
    return result

def check_booking_detail_validity(db: Session, hotel_id: int, room_type_id: int, rate_plan_id: int):
    query1 = (
        select (
            RatePlan.plan_id,
            RatePlan.room_type_id,
        )
        .where(
            and_(
                RatePlan.room_type_id == room_type_id,
                RatePlan.plan_id == rate_plan_id
            )
        )
    )
    query2 = (
        select (
            RoomType.room_type_id,
            RoomType.hotel_id
        )
        .where(
            and_(
                RoomType.room_type_id == room_type_id,
                RoomType.hotel_id == hotel_id
            )
        )
    )
    try:
        result1 = db.execute(query1).mappings().one()
        result2 = db.execute(query2).mappings().one()
        if result1 and result2:
            return True
        else:
            return False
    except Exception as e:
        return False