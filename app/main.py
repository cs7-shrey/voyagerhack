from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .routes import hotel, search
from ai import test
from . import models
from dotenv import load_dotenv
from . import models
from .database import engine, get_db

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

app.include_router(hotel.router)
app.include_router(search.router)

@app.get("/")
def read_root():
    test.test_function()
    return {"Hello": "World"}

@app.get("/test_hotel")
def test_hotel(db: Session = Depends(get_db)):
    # get 10 rows from table hotel
    hotels = db.query(models.Hotel).limit(10).all()
    return hotels
    # return {"Hello": "World"}