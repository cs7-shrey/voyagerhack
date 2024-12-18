from fastapi import APIRouter       
from ai import test

router = APIRouter(prefix="/hotel", tags=["hotel"])

@router.get("/")
def read_hotel():
    test.test_function()
    return {"Hello": "Hotel"}