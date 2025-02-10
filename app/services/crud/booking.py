from app.models import Booking
from app.schemas import BookHotelSchema
from sqlalchemy import select, and_
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