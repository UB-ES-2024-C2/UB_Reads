from pydantic import BaseModel


class BookBase(BaseModel):
    title: str
    author: str
    category: str
    year: int
    cover_url: str


class BookCreate(BookBase):
    pass


class BookUpdate(BookBase):
    pass


class Book(BookBase):
    id: int

    class Config:
        from_attributes = True
