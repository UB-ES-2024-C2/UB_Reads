from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from .database import Base

# Association table to link users and books
user_books = Table(
    "user_books",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("book_id", Integer, ForeignKey("books.id"), primary_key=True)
)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    # Many-to-many relationship: a user can own multiple books, and a book can be owned by multiple users
    books = relationship("Book", secondary=user_books, back_populates="owners")

class Book(Base):
    __tablename__ = "books"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String)
    
    # Many-to-many relationship: a book can have multiple owners (users)
    owners = relationship("User", secondary=user_books, back_populates="books")