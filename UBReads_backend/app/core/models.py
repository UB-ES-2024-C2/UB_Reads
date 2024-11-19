
from sqlalchemy import Column, Integer, String, ForeignKey, Table, Boolean
from sqlalchemy.orm import relationship
from .database import Base, engine

# Association table to link users and books
book_users = Table(
    "user_books",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("book_id", Integer, ForeignKey("books.id"), primary_key=True),
    Column("is_read", Boolean),
)


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    refresh_token = Column(String(255))
    # Many-to-many relationship:user own multiple books, book be owned by multiple users
    books = relationship("Book", secondary=book_users, back_populates="owners")


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    author = Column(String(255))
    description = Column(String(120))
    category = Column(String(50))
    year = Column(Integer)
    cover_url = Column(String(255))

    # Many-to-many relationship: a book can have multiple owners (users)
    owners = relationship("User", secondary=book_users, back_populates="books")


def create_tables():
    Base.metadata.create_all(engine)


def reset_database():
    # Elimina todas las tablas
    print("Eliminando todas las tablas...")
    Base.metadata.drop_all(bind=engine)

    # Crea las tablas nuevamente según los modelos actuales
    print("Recreando todas las tablas...")
    Base.metadata.create_all(bind=engine)
    print("Base de datos reiniciada.")
