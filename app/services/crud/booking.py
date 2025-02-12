from app.models import Booking, Hotel, RoomType, RatePlan
from app.schemas import BookHotelSchema
from sqlalchemy import select, and_, func
from sqlalchemy.orm import Session


def book_hotel(db: Session, user_id: int, booking_details: BookHotelSchema):
    try:
        booking = Booking(
            user_id = user_id,
            check_in = booking_details.check_in,
            check_out = booking_details.check_out,
            hotel_id = booking_details.hotel_id,
            room_type_id = booking_details.room_type_id,
            plan_id = booking_details.rate_plan_id
        )
        db.add(booking)
        db.commit()
        db.refresh(booking)
        return booking
    except Exception as e:
        print('an exeption occured while booking hotel', e)
        return None
    
def get_bookings_by_user_id(db: Session, user_id: int):
    query = (
        select(
            Booking.booking_id,
            Booking.check_in,
            Booking.check_out,
            func.json_build_object(
                'name', Hotel.name,
                'location', Hotel.location,
                'hotel_star', Hotel.hotel_star,
                'user_rating', Hotel.user_rating,
                'images', Hotel.images
            ).label('hotel'),  
            func.json_build_object(
                'room_type_name', RoomType.room_type_name,
                'max_adults', RoomType.max_adults,
            ).label('room_type'),
            func.json_build_object(
                'base_fare', RatePlan.base_fare,
                'total_discount', RatePlan.total_discount,
                'taxes', RatePlan.taxes
            ).label('rate_plan')
        )
        .where(Booking.user_id == user_id)
        .join(Hotel, Booking.hotel_id == Hotel.id)
        .join(RoomType, Booking.room_type_id == RoomType.room_type_id)
        .join(RatePlan, Booking.plan_id == RatePlan.plan_id)
    )
    result = db.execute(query).mappings().all()
    return result

def get_booking_info_by_id(db: Session, booking_id: int, user_id: int):
    query = (
        select(
            Booking.booking_id,
            Booking.check_in,
            Booking.check_out,
            func.json_build_object(
                'name', Hotel.name,
                'location', Hotel.location,
                'hotel_star', Hotel.hotel_star,
                'user_rating', Hotel.user_rating,
                'images', Hotel.images
            ).label('hotel'),  
            func.json_build_object(
                'room_type_name', RoomType.room_type_name,
                'max_adults', RoomType.max_adults,
            ).label('room_type'),
            func.json_build_object(
                'base_fare', RatePlan.base_fare,
                'total_discount', RatePlan.total_discount,
                'taxes', RatePlan.taxes
            ).label('rate_plan')
        )
        .where(
            and_(
                Booking.user_id == user_id,
                Booking.booking_id == booking_id
            )
        )
        .join(Hotel, Booking.hotel_id == Hotel.id)
        .join(RoomType, Booking.room_type_id == RoomType.room_type_id)
        .join(RatePlan, Booking.plan_id == RatePlan.plan_id)
    )
    result = db.execute(query).mappings().one()
    return result