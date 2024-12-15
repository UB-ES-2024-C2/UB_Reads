from sqlalchemy.orm import Session
from app.core.models import User
import os
from typing import Optional
from datetime import datetime, timedelta, timezone
import jwt
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = os.environ.get("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.environ.get("REFRESH_TOKEN_EXPIRE_DAYS", 7))

# Crear el contexto para manejar el hash de las contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserController:
    def __init__(self, db: Session):
        self.db = db

    @staticmethod
    def insert_user(db: Session, username: str, email: str, password: str):
        existing_user = db.query(User).filter(User.username == username).first()
        if existing_user:
            raise ValueError("El usuario ya existe")  # Puedes personalizar el mensaje

        existing_email = db.query(User).filter(User.email == email).first()
        if existing_email:
            print('ADIOS')
            raise ValueError("El correo electrónico ya está registrado")

        hashed_password = pwd_context.hash(password)  # Hashear la contraseña
        db_user = User(username=username, email=email, password=hashed_password, profile_pic=profile_pic)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def get_user(db: Session, user_id: int):
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_user_by_username(db: Session, username: str):
        return db.query(User).filter(User.username == username).first()

    @staticmethod
    def delete_user(db: Session, user: User):
        db_user = db.query(User).filter(User.id == user.id).first()
        if db_user:
            db.delete(db_user)
            db.commit()
            return True
        return False

    @staticmethod
    def get_users(db: Session):
        return db.query(User).all()

    @staticmethod
    def verify_password(plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(
                minutes=ACCESS_TOKEN_EXPIRE_MINUTES
            )
        to_encode.update({"exp": expire})
        print(f"Encoding token with SECRET_KEY: {SECRET_KEY} and ALGORITHM: {ALGORITHM}")
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    @staticmethod
    def create_refresh_token(data: dict):
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def follow_user_with_id(db: Session, user_id: int, to_follow_id: int):
        user = db.query(User).filter(User.id == user_id).first()
        to_follow = db.query(User).filter(User.id == to_follow_id).first()

        if not user or not to_follow:
            raise ValueError("User or target to follow not found")

        if to_follow in user.following:
            raise ValueError("User is already following this target")

        user.following.append(to_follow)
        db.commit()

    @staticmethod
    def follow_user_with_username(db: Session, username: str, to_follow_username: str):
        # Buscar al usuario actual y al objetivo por username
        user = db.query(User).filter(User.username == username).first()
        to_follow = db.query(User).filter(User.username == to_follow_username).first()

        if not user or not to_follow:
            raise ValueError("User or target to follow not found")

        if to_follow in user.following:
            raise ValueError("User is already following this target")

        # Agregar el usuario objetivo a la lista de "following"
        user.following.append(to_follow)
        db.commit()

    @staticmethod
    def unfollow_user(db: Session, user_id: int, to_unfollow_id: int):
        user = db.query(User).filter(User.id == user_id).first()
        to_unfollow = db.query(User).filter(User.id == to_unfollow_id).first()

        if not user or not to_unfollow:
            raise ValueError("User or target to unfollow not found")

        if to_unfollow not in user.following:
            raise ValueError("User is not following this target")

        user.following.remove(to_unfollow)
        db.commit()

    @staticmethod
    def get_followers(db: Session, user_id: int):
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
        return user.followers

    @staticmethod
    def get_following(db: Session, user_id: int):
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
        return user.following
