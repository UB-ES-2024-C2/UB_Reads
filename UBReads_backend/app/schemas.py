from pydantic import BaseModel
from typing import List

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class BookBase(BaseModel):
    title: str
    author: str

class BookCreate(BookBase):
    pass

class BookResponse(BookBase):
    id: int
    class Config:
        orm_mode = True

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    books: List[BookResponse] = []

    class Config:
        orm_mode = True