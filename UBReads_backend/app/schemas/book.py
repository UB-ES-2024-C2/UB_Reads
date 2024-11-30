from pydantic import BaseModel
from typing import List

class BookBase(BaseModel):
    id_book: str
    title: str
    author: str

class BookCreate(BookBase):
    pass

class BookResponse(BookBase):
    id: int
    class Config:
        orm_mode = True

