from pydantic import BaseModel
from .book import Book


class UserBookResponse(BaseModel):
    book: Book
    is_read: bool

    class Config:
        from_attributes = True
