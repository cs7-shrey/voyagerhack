from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import Request, Response, HTTPException, status, WebSocket
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from . import schemas
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))


def create_access_token(data: dict, expire_delta: timedelta | None = None):
    to_encode = data.copy()
    if expire_delta:
        expire_time = datetime.now(timezone.utc) + expire_delta
    else:
        expire_time = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire_time})                           # updates the dictionary with the elements from another dictionary
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str, credentials_exception: Exception):

    if not token:
        raise credentials_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get('user_id')
        token_data = schemas.TokenData(user_id = user_id)
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
            )
    except InvalidTokenError:
        raise credentials_exception
    return token_data

def get_current_client(request: Request):
    # print(request.cookies.get("access_token"))
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Couldn't not validate credentials",
    headers={"WWW-Authenticate": "Bearer"})
    token = request.cookies.get("access_token")
    token_data = verify_access_token(token, credentials_exception)
    return token_data

def socket_get_current_client(websocket: WebSocket):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Couldn't not validate credentials",
    headers={"WWW-Authenticate": "Bearer"})
    token = websocket.cookies.get("access_token")
    token_data = verify_access_token(token, credentials_exception)
    return token_data