import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
name = os.getenv("DB_NAME")
port = os.getenv("DB_PORT")

if user is None or password is None or host is None or name is None or port is None:
    raise Exception("Database credentials not found")

SQL_DATABASE_URL = (
    "postgresql+psycopg2://"
    + user
    + ":"
    + password
    + "@"
    + host
    + ":"
    + port
    + "/"
    + name
)

engine = create_engine(SQL_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
