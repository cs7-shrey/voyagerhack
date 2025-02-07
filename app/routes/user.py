from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from app import schemas
from app.services.crud.user import get_user_by_email, create_user, get_user_by_id
from app.services import hashing
from app.oauth2 import get_current_client
from app.database import get_db
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv
from ..oauth2 import create_access_token


load_dotenv()
router = APIRouter(prefix='/users', tags=['users'])

@router.post('/signup')
async def signup(user_info: schemas.UserCreate, response: Response, db: Session = Depends(get_db)):
    email = user_info.email
    check_user = get_user_by_email(db, email)
    if check_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
    user_info.password = hashing.hash(user_info.password)
    new_user = create_user(db, **user_info.model_dump())
    access_token = create_access_token({"user_id": new_user.user_id})
    response.set_cookie(
        key="access_token", 
        value=access_token, 
        httponly=True,  # This makes the cookie inaccessible to JavaScript
        secure=os.getenv('ENVIRONMENT') and os.getenv('ENVIRONMENT') == "PRODUCTION",    # Use this flag in production to send cookies only over HTTPS
        samesite="none",  # Protects against CSRF attacks
        # domain=os.getenv('BASE_FRONTEND_DOMAIN')  # TODO: change this in production
    )
    return {"message": "User created"}

@router.post('/login')
async def login(user_info: schemas.UserLogin, response: Response, db: Session = Depends(get_db)):
    user = get_user_by_email(db, user_info.email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if not hashing.verify(user_info.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token({"user_id": user.user_id})
    is_prod = os.getenv('ENVIRONMENT') == "PRODUCTION"
    response.set_cookie(
        key="access_token", 
        value=access_token, 
        httponly=True,  # This makes the cookie inaccessible to JavaScript
        secure= is_prod,    # Use this flag in production to send cookies only over HTTPS
        samesite="none" if is_prod else "lax",  # Protects against CSRF attacks
        domain=None if is_prod else os.getenv('BASE_FRONTEND_DOMAIN')  # TODO: change this in production
    )
    return {"message": "login successful"}

@router.post('/logout')
async def logout(request: Request, response: Response):
    if request.cookies.get("access_token"):
        response.delete_cookie("access_token")
        return {"message": "Logout successful"}
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No active session found")

@router.get('/checkauth')
async def check_auth(db: Session = Depends(get_db), current_user: schemas.TokenData = Depends(get_current_client)):
    try: 
        user = get_user_by_id(db, current_user.user_id)
        return {"email": user.email}
    except Exception as e:
        print(e)