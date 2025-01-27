from . import models
from . import models
from .database import engine, get_db
from .routes import search, constants, voice_search, user, hotel
from app.oauth2 import get_current_client
from dotenv import load_dotenv
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import time
import wave

load_dotenv()
# models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["*"]
# TODO: Change this to the actual frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(voice_search.router)
app.include_router(search.router)
app.include_router(constants.router)
app.include_router(user.router)
app.include_router(hotel.router)


@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.get("/test_hotel")
async def test_hotel(db: Session = Depends(get_db)):
    # get 10 rows from table hotel
    hotels = db.query(models.Hotel).limit(10).all()
    return hotels

@app.get('/protected')
async def protected_route(token_data: dict = Depends(get_current_client)):
    print(token_data)
    return {"message": "You are under protected data"}