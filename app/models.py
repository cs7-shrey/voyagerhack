from sqlalchemy import create_engine, MetaData, Table, inspect, ForeignKey
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, BigInteger, ARRAY, UniqueConstraint
from typing import List, Optional
from .database import Base


class Hotel(Base):
    __tablename__ = "hotel"
    id = Column(BigInteger, primary_key=True)
    gi_id = Column(BigInteger, nullable=False, unique=True)
    name = Column(String)
    location = Column(String)
    star_rating = Column(Integer)
    user_rating = Column(Float)
    user_rating_count = Column(Integer, default=0)
    property_type = Column(String)
    images = Column(ARRAY(String))
    uuids = Column(ARRAY(String))
    
class HotelAmenity(Base):
    __tablename__ = "hotel_amenity"
    amen_id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False, unique=True)
    
class HotelAmenityMapping(Base):
    __tablename__ = "hotel_amenity_mapping"
    hotel_id = Column(BigInteger, ForeignKey("hotel.id") , primary_key=True) 
    amen_id = Column(Integer, ForeignKey("hotel_amenity.amen_id"), primary_key=True)