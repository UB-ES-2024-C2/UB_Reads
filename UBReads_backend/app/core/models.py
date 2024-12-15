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

# Tabla de asociación para seguidores
followers = Table(
    "followers",
    Base.metadata,
    Column("follower_id", Integer, ForeignKey("users.id"), primary_key=True),  # Usuario que sigue
    Column("followed_id", Integer, ForeignKey("users.id"), primary_key=True),  # Usuario seguido
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    refresh_token = Column(String(255))

    # Many-to-many relationships for followers
    following = relationship(
        "User",
        secondary=followers,
        primaryjoin=id == followers.c.follower_id,
        secondaryjoin=id == followers.c.followed_id,
        backref="followers",
    )

    # Many-to-many relationship with books
    books = relationship("Book", secondary=book_users, back_populates="owners")

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    id_book = Column(String(50))
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


def reset_database(engine = engine):
    # Elimina todas las tablas
    print("Eliminando todas las tablas...")
    Base.metadata.drop_all(bind=engine)

    # Crea las tablas nuevamente según los modelos actuales
    print("Recreando todas las tablas...")
    Base.metadata.create_all(bind=engine)
    print("Base de datos reiniciada.")
