import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.database import Base, engine, SessionLocal, get_db


# Test if the database engine connects successfully
def test_database_connection():
    try:
        connection = engine.connect()
        assert connection is not None
        connection.close()
    except Exception as e:
        pytest.fail(f"Database connection test failed: {e}")


# Test if the Base metadata is initialized correctly
def test_base_initialization():
    assert Base.metadata is not None
    assert isinstance(Base.metadata.tables, dict)


# Test the session creation
def test_session_creation():
    session = SessionLocal()
    try:
        assert session is not None
        session.execute(text("SELECT 1"))  # Execute a simple SQL query
    finally:
        session.close()


# Test the `get_db` dependency generator
def test_get_db():
    db_generator = get_db()
    db = next(db_generator)
    try:
        assert db is not None
        db.execute(text("SELECT 1"))
    finally:
        db_generator.close()
