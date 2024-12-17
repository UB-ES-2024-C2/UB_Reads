import pytest
import jwt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.models import Base, User
from app.controllers.user_controller import UserController


SQL_TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(SQL_TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=test_engine)
    session = TestSessionLocal()
    yield session
    session.close()
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def user_controller(db_session):
    return UserController(db=db_session)


def test_performance_insert_user(benchmark, user_controller, db_session):
    def create_user():
        count = len(user_controller.get_users(db_session))
        username = f"testuser_{count}"
        user_controller.insert_user(db_session, username, f"test{count}@example.com", "securepassword", "profile_pic")

    result = benchmark(create_user)
    assert result is None


def test_performance_create_access_token(benchmark, user_controller):
    data = {"sub": "testuser"}
    result = benchmark(user_controller.create_access_token, data)
    assert isinstance(result, str)  # Ensure the token is a string


def test_performance_follow_user(benchmark, user_controller, db_session):
    def setup_and_follow():
        # Drop and recreate the database schema to ensure a clean state
        Base.metadata.drop_all(bind=db_session.get_bind())
        Base.metadata.create_all(bind=db_session.get_bind())

        user1 = user_controller.insert_user(db_session, "testuser1", "test1@example.com", "securepassword", "profile_pic")
        user2 = user_controller.insert_user(db_session, "testuser2", "test2@example.com", "securepassword", "profile_pic")
        user_controller.follow_user_with_id(db_session, user1.id, user2.id)

    benchmark(setup_and_follow)


def test_performance_get_followers(benchmark, user_controller, db_session):
    user1 = user_controller.insert_user(db_session, "testuser1", "test1@example.com", "securepassword", "profile_pic")
    user2 = user_controller.insert_user(db_session, "testuser2", "test2@example.com", "securepassword", "profile_pic")
    user_controller.follow_user_with_id(db_session, user2.id, user1.id)

    def get_followers():
        return user_controller.get_followers(db_session, user1.id)

    followers = benchmark(get_followers)
    assert len(followers) == 1
    assert followers[0].id == user2.id
