
from pydantic import BaseModel
from typing import List, Optional


class UserBase(BaseModel):
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
    id: int


class Config:
    from_attributes = True
