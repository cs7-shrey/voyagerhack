from app import models
from sqlalchemy.orm import Session

def get_user_by_email(db: Session, email: str):
    return db.query(models.PlatformUser).filter(models.PlatformUser.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.PlatformUser).filter(models.PlatformUser.user_id == user_id).first()

def create_user(db: Session, name: str, email: str, password: str):
    user = models.PlatformUser(name=name, email=email, password=password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def delete_user(db, user: models.PlatformUser):
    db.delete(user)
    db.commit()
    return

