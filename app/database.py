from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os 
from dotenv import load_dotenv

load_dotenv()
ORM_URL = os.getenv('ORM_URL')
engine = create_engine(ORM_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)                          # session local is also a class
Base = declarative_base()    

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
