from sqlalchemy.orm import Session, aliased
from sqlalchemy import String
from sqlalchemy import select, and_, func
from app.models import Hotel, HotelAmenityMapping, HotelAmenity, RoomType, RoomAmenity, RoomAmenityMapping, RatePlan

def get_hotel_info_by_id(id: int, db: Session):
    # HotelAmenityMapping 
    ham = aliased(HotelAmenityMapping)
    ha = aliased(HotelAmenity)
    query = (
        select(
            func.cast(Hotel.id, String),
            func.cast(Hotel.gi_id, String),
            Hotel.name,
            Hotel.location,
            Hotel.hotel_star,
            Hotel.user_rating,
            Hotel.user_rating_count,
            Hotel.property_type,
            Hotel.images,
            func.array_agg(ha.name).label('amenities'),
    )
    .where(Hotel.id == str(id))
    .join(ham, Hotel.id == ham.hotel_id)
    .join(ha, ham.amen_id == ha.amen_id)
    .group_by(Hotel.id, Hotel.gi_id, Hotel.name, Hotel.location, Hotel.hotel_star, Hotel.user_rating, Hotel.user_rating_count, Hotel.property_type, Hotel.images)
    )
    results = db.execute(query).mappings().one()
    return dict(results)

def get_hotel_room_info(id: int, db: Session):
    rt = aliased(RoomType)
    rp = aliased(RatePlan)
    room_types = (
        select (
            rt
        )
        .where(Hotel.id == id)
        .join(Hotel, rt.hotel_id == Hotel.id)
        .cte('room_types')
    )
    # TODO: OPTIMIZE THIS
    rate_plans = (
        select(
            rp.room_type_id,
            func.json_agg(
                func.json_build_object(
                    'plan_id', rp.plan_id,
                    'pay_mode', rp.pay_mode,
                    'base_fare', rp.base_fare,
                    'total_discount', rp.total_discount,
                    'taxes', rp.taxes,
                    'filter_code', rp.filter_code
                )
            ).label('rate_plans'),
        )
        .group_by(rp.room_type_id)
        .cte('rate_plans')
    )
    final_query = (
        select(
            room_types.c.room_type_id,
            room_types.c.room_type_name,
            room_types.c.room_photos,
            room_types.c.max_guests,
            room_types.c.max_adults,
            room_types.c.max_children,
            room_types.c.beds,
            room_types.c.display_amenities,
            rate_plans
        )
        .join(rate_plans, room_types.c.room_type_id == rate_plans.c.room_type_id)    # one to one, since we aggregated earlier   
    )
    results = db.execute(final_query).mappings().all()
    return results