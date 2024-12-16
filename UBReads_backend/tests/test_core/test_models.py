import pytest
from sqlalchemy import create_engine
from sqlalchemy import inspect
from sqlalchemy.orm import sessionmaker
from app.core.database import Base, get_db
from fastapi.testclient import TestClient
from app.core.models import User, Book, create_tables, reset_database
from main import app

TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
# single connection for entire lifecycle of tests
testing_connection = test_engine.connect()
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=testing_connection)


# Fixture to set up the database and create tables once
@pytest.fixture(scope="function", autouse=True)
def setup_test_db():
    # Use same connection for creating tables
    Base.metadata.create_all(bind=testing_connection)
    yield

    # Drop tables after the test
    Base.metadata.drop_all(bind=testing_connection)

# Fixture to override get_db and use same session
@pytest.fixture(scope="function")
def client():
    def override_get_db():
        db = TestingSessionLocal()  # Reuse same connection
        try:
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c


# Test cases
def test_create_tables(client):
    inspector = inspect(test_engine)
    tables = inspector.get_table_names()
    assert "users" in tables
    assert "books" in tables
    assert "user_books" in tables
    assert "followers" in tables


def test_reset_database(client):
    reset_database(engine=test_engine)
    inspector = inspect(test_engine)
    tables = inspector.get_table_names()
    assert "users" in tables
    assert "books" in tables
    assert "user_books" in tables
    assert "followers" in tables