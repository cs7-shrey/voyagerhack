from app.models import Hotel, City, HotelAmenityMapping, HotelAmenity, RoomType, RoomAmenityMapping, RoomAmenity, RatePlan
from app.schemas import SearchFilters
from geoalchemy2 import Geometry, Geography
from sqlalchemy import select, func, and_
from sqlalchemy.orm import Session
from sqlalchemy import String

def get_hotels_with_filters(filters: SearchFilters, session: Session):
    mapping = {
        "city": City.name,
        "location": Hotel.location, 
        "hotel": Hotel.name
    }
    # First CTE (temp_var)
    # filtering based on star, rating and location
    if not filters.place.type in mapping:
        return []
    if not filters.property_type:
        # TODO: get this from db
        filters.property_type = ['Apartment', 'Homestay', 'Guest House', 'Hostel', 'Resort', 'Villa', 'Camp', 'Hotel']
    q1 = (
        select(
            func.cast(Hotel.id, String),
            Hotel.name.label('hotel_name'),
            Hotel.hotel_star,
            Hotel.user_rating,
            Hotel.user_rating_count,
            Hotel.location,
            Hotel.images,
            func.st_x(func.cast(Hotel.coordinate, Geometry)).label('longitude'),
            func.st_y(func.cast(Hotel.coordinate, Geometry)).label('latitude'),
        )
        .join(City, Hotel.city_id == City.city_id)
        .where(
            and_(
                Hotel.hotel_star.in_(filters.hotel_star),
                Hotel.user_rating >= filters.user_rating,
                Hotel.property_type.in_(filters.property_type),
                mapping[filters.place.type] == filters.place.name
            )
        )
        .cte('q1')
    )

    # Second CTE (q2)
    # filtering based on hotel amenities
    q2 = (
        select(
            q1.c.id,
            q1.c.hotel_name,
            q1.c.hotel_star,
            q1.c.location,
            q1.c.user_rating,
            q1.c.user_rating_count,
            q1.c.images,
            q1.c.latitude,
            q1.c.longitude
        )
        .join(HotelAmenityMapping, q1.c.id == func.cast(HotelAmenityMapping.hotel_id, String))
        .join(HotelAmenity, HotelAmenityMapping.amen_id == HotelAmenity.amen_id)
        .where(HotelAmenity.code.in_(filters.hotel_amenity_codes))
        .group_by(q1.c.id, q1.c.hotel_name, q1.c.hotel_star, q1.c.location, q1.c.user_rating, q1.c.user_rating_count, q1.c.images, q1.c.longitude, q1.c.latitude)
        .having(func.count(HotelAmenity.code) == len(filters.hotel_amenity_codes))
        .cte('q2')
    ) if filters.hotel_amenity_codes else q1

    q4 = (
        select(
            q2,
            RoomType.room_type_id
        )
        .join(RoomType, q2.c.id == func.cast(RoomType.hotel_id, String))
        .join(RoomAmenityMapping, RoomType.room_type_id == RoomAmenityMapping.room_type_id)
        .join(RoomAmenity, RoomAmenity.room_amen_id == RoomAmenityMapping.room_amen_id)
        .where(RoomAmenity.code.in_(filters.room_amenity_codes))
        .group_by(q2.c.id, q2.c.hotel_name, q2.c.hotel_star, q2.c.location, q2.c.user_rating, q2.c.user_rating_count, q2.c.images, q2.c.longitude, q2.c.latitude, RoomType.room_type_id)
        .having(func.count(RoomAmenity.code) == len(filters.room_amenity_codes))
        .cte('q4')
    ) if filters.room_amenity_codes else (
        select(
            q2,
            RoomType.room_type_id
        )
        .join(RoomType, q2.c.id == func.cast(RoomType.hotel_id, String))
        .group_by(q2.c.id, q2.c.hotel_name, q2.c.hotel_star, q2.c.location, q2.c.user_rating, q2.c.user_rating_count, q2.c.images, q2.c.longitude, q2.c.latitude, RoomType.room_type_id)
        .cte('q4')
    )

    # Final query with named columns
    # groupin duplicate rows due to room amenities join
    q5 = (
        select(
            q4.c.id.label('id'),
            q4.c.hotel_name.label('name'),
            q4.c.hotel_star.label('hotel_star'),
            q4.c.location.label('location'),
            q4.c.user_rating.label('user_rating'),
            q4.c.user_rating_count.label('user_rating_count'),
            q4.c.images.label('images'),
            q4.c.longitude.label('longitude'),
            q4.c.latitude.label('latitude'),
            q4.c.room_type_id.label('room_type_id'),
            RatePlan.base_fare.label('base_fare'),
            RatePlan.total_discount.label('total_discount'),
            RatePlan.taxes.label('taxes')
        )
        .distinct(q4.c.id)      
        .join(RatePlan, q4.c.room_type_id == RatePlan.room_type_id)
        .order_by(q4.c.id, RatePlan.base_fare.asc())
        .cte('q5')
    )
    # final query
    # filtering based on budget
    q6 = (
        select(q5)
        .where(
            and_(
                q5.c.base_fare >= filters.min_budget,
                q5.c.base_fare <= filters.max_budget
            )
        ) 
        .cte('q6')
    )
    final_query = (
        select(
            q6, 
        )
        .join(Hotel, q6.c.id == func.cast(Hotel.id, String))
        .where(func.ST_DWithin(Hotel.coordinate, func.cast(func.ST_MakePoint(filters.proximity_coordinate.longitude, filters.proximity_coordinate.latitude), Geography), 5000))
        .order_by(
            func.ST_Distance(
                Hotel.coordinate, 
                    func.cast(
                        func.ST_MakePoint(filters.proximity_coordinate.longitude, filters.proximity_coordinate.latitude), 
                        Geography
                    )
            ).label('distance')  
        )
        .limit(20)
    ) if filters.proximity_coordinate else (
        select (
            q6
        )
        .limit(20)
    ) 
    results = []
    results = session.execute(final_query).mappings().all()
    return results

        
















query = """
    with temp_var as (
        select hotel.id, hotel.name as hotel_name, hotel.hotel_star, hotel.user_rating, hotel.location from hotel join city on hotel.city_id = city.city_id where hotel_star > 4 and user_rating > 4 and city.name = 'Faridabad'
    ),

    q2 as (
    select * from temp_var natural join hotel_amenity_mapping join hotel_amenity on hotel_amenity_mapping.amen_id = hotel_amenity.amen_id where hotel_amenity.code in ('AIRTRANS', 'INTRNT')
    ),

    q3 as (
    select distinct on(id) id, hotel_name, hotel_star, location, user_rating from q2
    ),

    q4 as (
    select q3.*, rt.room_type_id from q3 join room_type rt on q3.id = rt.hotel_id join room_amenity_mapping ram on rt.room_type_id = ram.room_type_id join room_amenity ra on ra.room_amen_id = ram.room_amen_id where ra.code in ('INTRNT', 'STDYRM')
    )

    SELECT DISTINCT ON (q4.id) 
        q4.id, 
        q4.hotel_name, 
        q4.hotel_star, 
        q4.location, 
        q4.user_rating, 
        q4.room_type_id, 
        rp.base_fare, 
        rp.total_discount, 
        rp.taxes 
    FROM q4 
    JOIN rate_plan rp ON q4.room_type_id = rp.room_type_id 
    ORDER BY q4.id, rp.base_fare ASC;     
"""