import pytest
import jwt
import os
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

def test_insert_user(user_controller, db_session):
    user = user_controller.insert_user(db_session, "testuser", "test@example.com", "securepassword")
    assert user.username == "testuser"
    assert user.email == "test@example.com"
    assert user_controller.verify_password("securepassword", user.password)

def test_insert_user_duplicate_username(user_controller, db_session):
    user_controller.insert_user(db_session, "testuser", "test1@example.com", "securepassword")
    with pytest.raises(ValueError, match="El usuario ya existe"):
        user_controller.insert_user(db_session, "testuser", "test2@example.com", "securepassword")

def test_insert_user_duplicate_email(user_controller, db_session):
    user_controller.insert_user(db_session, "testuser1", "test@example.com", "securepassword")
    with pytest.raises(ValueError, match="El correo electrónico ya está registrado"):
        user_controller.insert_user(db_session, "testuser2", "test@example.com", "securepassword")

def test_get_user(user_controller, db_session):
    user = user_controller.insert_user(db_session, "testuser", "test@example.com", "securepassword")
    fetched_user = user_controller.get_user(db_session, user.id)
    assert fetched_user.id == user.id
    assert fetched_user.username == "testuser"

def test_get_user_not_found(user_controller, db_session):
    fetched_user = user_controller.get_user(db_session, 999)  
    
    assert fetched_user is None

def test_get_user_by_username(user_controller, db_session):
    user = user_controller.insert_user(db_session, "testuser", "test@example.com", "securepassword")
    
    fetched_user = user_controller.get_user_by_username(db_session, "testuser")
    assert fetched_user is not None
    assert fetched_user.username == "testuser"
    assert fetched_user.email == "test@example.com"

def test_get_user_by_username_not_found(user_controller, db_session):
    fetched_user = user_controller.get_user_by_username(db_session, "nonexistentuser")
    
    assert fetched_user is None

def test_delete_user(user_controller, db_session):
    user = user_controller.insert_user(db_session, "testuser", "test@example.com", "securepassword")
    result = user_controller.delete_user(db_session, user)
    assert result is True
    assert user_controller.get_user(db_session, user.id) is None

def test_get_users(user_controller, db_session):
    user1 = user_controller.insert_user(db_session, "testuser1", "test1@example.com", "securepassword")
    user2 = user_controller.insert_user(db_session, "testuser2", "test2@example.com", "securepassword")
    

    users = user_controller.get_users(db_session)
    

    assert len(users) == 2 
    assert users[0].id == user1.id
    assert users[0].username == "testuser1"
    assert users[1].id == user2.id
    assert users[1].username == "testuser2"

def test_get_users_empty(user_controller, db_session):
    users = user_controller.get_users(db_session)
    
    assert len(users) == 0


def test_verify_password(user_controller, db_session):
    user = user_controller.insert_user(db_session, "testuser", "test@example.com", "securepassword")
    assert user_controller.verify_password("securepassword", user.password)
    assert not user_controller.verify_password("wrongpassword", user.password)

def test_create_access_token(user_controller):
    data = {"sub": "testuser"}
    token = user_controller.create_access_token(data)
    decoded = jwt.decode(token, os.environ.get("SECRET_KEY"), algorithms=[os.environ.get("ALGORITHM")])
    assert decoded["sub"] == "testuser"

def test_create_refresh_token(user_controller):
    data = {"sub": "testuser"}
    token = user_controller.create_refresh_token(data)
    decoded = jwt.decode(token, os.environ.get("SECRET_KEY"), algorithms=[os.environ.get("ALGORITHM")])
    assert decoded["sub"] == "testuser"

def test_follow_user_with_id(user_controller, db_session):
    user1 = user_controller.insert_user(db_session, "testuser1", "test1@example.com", "securepassword")
    user2 = user_controller.insert_user(db_session, "testuser2", "test2@example.com", "securepassword")
    
    user_controller.follow_user_with_id(db_session, user1.id, user2.id)
    
    assert user2 in user1.following
    assert user1 in user2.followers 

def test_follow_user_with_id_user_not_found(user_controller, db_session):
    user1 = user_controller.insert_user(db_session, "testuser1", "test1@example.com", "securepassword")
    
    with pytest.raises(ValueError, match="User or target to follow not found"):
        user_controller.follow_user_with_id(db_session, user1.id, 999) 

def test_follow_user_with_id_target_not_found(user_controller, db_session):
    user1 = user_controller.insert_user(db_session, "testuser1", "test1@example.com", "securepassword")
    user2 = user_controller.insert_user(db_session, "testuser2", "test2@example.com", "securepassword")
    
    with pytest.raises(ValueError, match="User or target to follow not found"):
        user_controller.follow_user_with_id(db_session, user1.id, 999) 

def test_follow_user_with_id_already_following(user_controller, db_session):
    user1 = user_controller.insert_user(db_session, "testuser1", "test1@example.com", "securepassword")
    user2 = user_controller.insert_user(db_session, "testuser2", "test2@example.com", "securepassword")
    
    user_controller.follow_user_with_id(db_session, user1.id, user2.id)
    
    with pytest.raises(ValueError, match="User is already following this target"):
        user_controller.follow_user_with_id(db_session, user1.id, user2.id)

def test_follow_user_with_username(user_controller, db_session):
    user1 = user_controller.insert_user(db_session, "testuser1", "test1@example.com", "securepassword")
    user2 = user_controller.insert_user(db_session, "testuser2", "test2@example.com", "securepassword")
    
    user_controller.follow_user_with_username(db_session, "testuser1", "testuser2")
    
    assert user2 in user1.following
    assert user1 in user2.followers  

def test_follow_user_with_username_user_not_found(user_controller, db_session):
    user1 = user_controller.insert_user(db_session, "testuser1", "test1@example.com", "securepassword")
    
    with pytest.raises(ValueError, match="User or target to follow not found"):
        user_controller.follow_user_with_username(db_session, "testuser1", "nonexistentuser") 

def test_follow_user_with_username_target_not_found(user_controller, db_session):
    user1 = user_controller.insert_user(db_session, "testuser1", "test1@example.com", "securepassword")
    user2 = user_controller.insert_user(db_session, "testuser2", "test2@example.com", "securepassword")
    
    with pytest.raises(ValueError, match="User or target to follow not found"):
        user_controller.follow_user_with_username(db_session, "testuser1", "nonexistentuser")  
def test_follow_user_with_username_already_following(user_controller, db_session):
    user1 = user_controller.insert_user(db_session, "testuser1", "test1@example.com", "securepassword")
    user2 = user_controller.insert_user(db_session, "testuser2", "test2@example.com", "securepassword")
    
    user_controller.follow_user_with_username(db_session, "testuser1", "testuser2")
    
    with pytest.raises(ValueError, match="User is already following this target"):
        user_controller.follow_user_with_username(db_session, "testuser1", "testuser2")
def test_follow_user_with_username(user_controller, db_session):
    user1 = user_controller.insert_user(db_session, "testuser1", "test1@example.com", "securepassword")
    user2 = user_controller.insert_user(db_session, "testuser2", "test2@example.com", "securepassword")
    
    user_controller.follow_user_with_username(db_session, "testuser1", "testuser2")
    
    assert user2 in user1.following
    assert user1 in user2.followers

def test_follow_user_with_username_user_not_found(user_controller, db_session):
    user1 = user_controller.insert_user(db_session, "testuser1", "test1@example.com", "securepassword")
    
    with pytest.raises(ValueError, match="User or target to follow not found"):
        user_controller.follow_user_with_username(db_session, "testuser1", "nonexistentuser")

def test_follow_user_with_username_target_not_found(user_controller, db_session):
    user1 = user_controller.insert_user(db_session, "testuser1", "test1@example.com", "securepassword")
    user2 = user_controller.insert_user(db_session, "testuser2", "test2@example.com", "securepassword")
    
    with pytest.raises(ValueError, match="User or target to follow not found"):
        user_controller.follow_user_with_username(db_session, "testuser1", "nonexistentuser") 

def test_follow_user_with_username_already_following(user_controller, db_session):
    user1 = user_controller.insert_user(db_session, "testuser1", "test1@example.com", "securepassword")
    user2 = user_controller.insert_user(db_session, "testuser2", "test2@example.com", "securepassword")
    
    user_controller.follow_user_with_username(db_session, "testuser1", "testuser2")
    
    with pytest.raises(ValueError, match="User is already following this target"):
        user_controller.follow_user_with_username(db_session, "testuser1", "testuser2")

def test_unfollow_user(user_controller, db_session):
    user1 = user_controller.insert_user(db_session, "testuser1", "test1@example.com", "securepassword")
    user2 = user_controller.insert_user(db_session, "testuser2", "test2@example.com", "securepassword")
    
    user_controller.follow_user_with_username(db_session, "testuser1", "testuser2")
    
    user_controller.unfollow_user(db_session, user1.id, user2.id)
    
    assert user2 not in user1.following
    assert user1 not in user2.followers 

def test_unfollow_user_user_not_found(user_controller, db_session):
    user1 = user_controller.insert_user(db_session, "testuser1", "test1@example.com", "securepassword")
    
    with pytest.raises(ValueError, match="User or target to unfollow not found"):
        user_controller.unfollow_user(db_session, user1.id, 999) 

def test_unfollow_user_not_following(user_controller, db_session):
    user1 = user_controller.insert_user(db_session, "testuser1", "test1@example.com", "securepassword")
    user2 = user_controller.insert_user(db_session, "testuser2", "test2@example.com", "securepassword")
    
    with pytest.raises(ValueError, match="User is not following this target"):
        user_controller.unfollow_user(db_session, user1.id, user2.id)

def test_get_followers(user_controller, db_session):
    user1 = user_controller.insert_user(db_session, "testuser1", "test1@example.com", "securepassword")
    user2 = user_controller.insert_user(db_session, "testuser2", "test2@example.com", "securepassword")
    
    user_controller.follow_user_with_username(db_session, "testuser2", "testuser1")
    
    followers = user_controller.get_followers(db_session, user1.id)
    
    assert len(followers) == 1
    assert followers[0].id == user2.id

def test_get_followers_user_not_found(user_controller, db_session):
    with pytest.raises(ValueError, match="User not found"):
        user_controller.get_followers(db_session, 999)  

def test_get_following(user_controller, db_session):
    user1 = user_controller.insert_user(db_session, "testuser1", "test1@example.com", "securepassword")
    user2 = user_controller.insert_user(db_session, "testuser2", "test2@example.com", "securepassword")
    
    user_controller.follow_user_with_username(db_session, "testuser1", "testuser2")
    
    following = user_controller.get_following(db_session, user1.id)
    
    assert len(following) == 1
    assert following[0].id == user2.id

def test_get_following_user_not_found(user_controller, db_session):
    with pytest.raises(ValueError, match="User not found"):
        user_controller.get_following(db_session, 999)  
