from typing import List
from pydantic import BaseModel


class UserBase(BaseModel):
    id: int
    username: str
    email: str


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserUpdate(UserBase):
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class User(UserBase):
    
    followers: List[UserBase] = []  # Lista de seguidores
    following: List[UserBase] = []  # Lista de usuarios seguidos

    class Config:
        from_attributes = True
