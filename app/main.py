from . import models
from . import models
from .database import engine, get_db
from app.routes import search, constants, voice_search, user, hotel, voice, room, cpkit
from copilotkit.integrations.fastapi import add_fastapi_endpoint
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

origins = [
    "http://localhost:5173",
    os.getenv("BASE_FRONTEND_URL")
]
print(os.getenv("BASE_FRONTEND_URL"), os.getenv("BASE_FRONTEND_DOMAIN"))

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
app.include_router(voice.router)
app.include_router(room.router)
add_fastapi_endpoint(app, cpkit.sdk, '/copilotkit_remote')


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
    return {"message": "You are under protected"}
