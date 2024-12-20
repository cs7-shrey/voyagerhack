from sqlalchemy import create_engine, MetaData, Table, inspect
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
    