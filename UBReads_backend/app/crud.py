from passlib.context import CryptContext
from sqlalchemy.orm import Session
from . import models, schemas
from .models import User, Book

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate, hashed_password: str):
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def hash_password(password: str):
    return pwd_context.hash(password)

def get_book_by_title_and_author(db: Session, title: str, author: str):
    return db.query(Book).filter(Book.title == title, Book.author == author).first()