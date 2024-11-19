from pydantic import BaseModel


class UserBookBase(BaseModel):
    user_id: int
    book_id: int
    is_read: bool


class UserBookCreate(UserBookBase):
    pass


class UserBookUpdate(BaseModel):
    is_read: bool


class UserBook(UserBookBase):
    id: int

    class Config:
        from_attributes = True