from fastapi import FastAPI, APIRouter, Depends
from app.database import get_db
from sqlalchemy.orm import Session
from app import models
from app import schemas

router = APIRouter(prefix="/constants", tags=["constants"])

@router.get("/{type}/", response_model=list[schemas.Constants])
def get_constants(type: str, db: Session = Depends(get_db)):
    if type == "property_type":
        db_results = db.query(models.Hotel.property_type.label("name")).distinct().all()
        # results = [row.property_type for row in db_results]
    else:
        # db_results = db.query
        mapping = {
            "hotel_amenity": models.HotelAmenity,
            "room_amenity": models.RoomAmenity
        }
        db_results = db.query(mapping[type].name, mapping[type].code).all()
    
    return db_results
