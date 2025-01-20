from sqlalchemy import create_engine, MetaData, Table, inspect, ForeignKey
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, BigInteger, ARRAY, UniqueConstraint, JSON
from typing import List, Optional
from .database import Base


class PlatformUser(Base):
    __tablename__ = "platform_user"
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True)
    password = Column(String, nullable=False)

class Hotel(Base):
    __tablename__ = "hotel"
    id = Column(BigInteger, primary_key=True)
    gi_id = Column(BigInteger, nullable=False, unique=True)
    name = Column(String)
    location = Column(String)
    hotel_star = Column(Integer)
    user_rating = Column(Float)
    user_rating_count = Column(Integer, default=0)
    property_type = Column(String)
    images = Column(ARRAY(String))
    uuids = Column(ARRAY(String))
    city_id = Column(Integer, ForeignKey("city.city_id"))
    
class HotelAmenity(Base):
    __tablename__ = "hotel_amenity"
    amen_id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False, unique=True)
    
class HotelAmenityMapping(Base):
    __tablename__ = "hotel_amenity_mapping"
    hotel_id = Column(BigInteger, ForeignKey("hotel.id") , primary_key=True) 
    amen_id = Column(Integer, ForeignKey("hotel_amenity.amen_id"), primary_key=True)
    
class RoomType(Base):
    __tablename__ = "room_type"
    hotel_id = Column(BigInteger, ForeignKey("hotel.id"))
    room_type_id = Column(Integer, primary_key=True, nullable=False)
    room_type_name = Column(String, nullable=False)
    room_photos = Column(ARRAY(String))
    max_guests = Column(Integer)
    max_adults = Column(Integer)
    max_children = Column(Integer)
    beds = Column(JSON)
    display_amenities = Column(ARRAY(String))

class RatePlan(Base):
    __tablename__ = "rate_plan"
    plan_id = Column(Integer, primary_key=True, nullable=False)
    room_type_id = Column(Integer, ForeignKey("room_type.room_type_id"), nullable=False)
    pay_mode = Column(String)
    filter_code = Column(ARRAY(String))
    base_fare = Column(Float)
    total_discount = Column(Float)
    taxes = Column(Float)

class RoomAmenity(Base):
    __tablename__ = "room_amenity"
    room_amen_id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String)
    code = Column(String, unique=True)
    
class RoomAmenityMapping(Base):
    __tablename__ = "room_amenity_mapping"
    room_type_id = Column(Integer, ForeignKey("room_type.room_type_id"), primary_key=True)
    room_amen_id = Column(Integer, ForeignKey("room_amenity.room_amen_id"), primary_key=True)

class City(Base):
    __tablename__ = "city"
    city_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    
class Country(Base):
    __tablename__ = "country"
    country_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)