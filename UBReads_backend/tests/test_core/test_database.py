"""import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base, get_db
from app.core.models import User

# Set up a temporary in-memory database for testing purposes
SQL_DATABASE_URL = "postgresql+psycopg2://user:password@localhost:5432/test_db"

# Create a new engine for testing
engine = create_engine(SQL_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables in the test database
Base.metadata.create_all(bind=engine)

@pytest.fixture(scope="function")
def db():
    #Fixture that provides a fresh database session for each test.
    db = SessionLocal()
    yield db
    db.close()
    # Clean up (optional but recommended for isolated tests)
    for table in reversed(Base.metadata.sorted_tables):
        engine.execute(table.delete())

def test_create_user(db):
    #Test creating a user in the database.
    new_user = User(name="John Doe", email="john@example.com")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Assert user is correctly saved
    assert new_user.id is not None
    assert new_user.name == "John Doe"
    assert new_user.email == "john@example.com"
"""
