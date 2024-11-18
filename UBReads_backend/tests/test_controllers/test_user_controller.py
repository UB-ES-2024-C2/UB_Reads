"""import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.models import User, Base
from app.controllers.user_controller import UserController

# Configuración de la base de datos en memoria para pruebas
DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Configuración de las pruebas
@pytest.fixture(scope="function")
def db_session():
    # Crear las tablas en la base de datos en memoria
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Eliminar las tablas después de cada prueba
        Base.metadata.drop_all(bind=engine)

# Test: Insertar un nuevo usuario exitosamente
def test_insert_user(db_session):
    controller = UserController(db_session)
    new_user = controller.insert_user(
        db=db_session, username="testuser", email="test@example.com",
        password="Test1234!"
    )
    assert new_user.username == "testuser"
    assert new_user.email == "test@example.com"
    assert db_session.query(User).count() == 1

# Test: Insertar un usuario con un nombre de usuario duplicado
def test_insert_user_duplicate_username(db_session):
    controller = UserController(db_session)
    controller.insert_user(
        db=db_session, username="testuser",
        email="test1@example.com", password="Test1234!"
    )
    with pytest.raises(ValueError, match="El usuario ya existe"):
        controller.insert_user(
            db=db_session, username="testuser",
            email="test2@example.com", password="Test5678!"
        )

# Test: Insertar un usuario con un correo duplicado
def test_insert_user_duplicate_email(db_session):
    controller = UserController(db_session)
    controller.insert_user(
        db=db_session, username="testuser1",
        email="test@example.com", password="Test1234!"
    )
    with pytest.raises(ValueError, match="El correo electrónico ya está registrado"):
        controller.insert_user(
            db=db_session, username="testuser2",
            email="test@example.com", password="Test5678!"
        )

# Test: Obtener un usuario por ID
def test_get_user(db_session):
    controller = UserController(db_session)
    new_user = controller.insert_user(
        db=db_session, username="testuser", email="test@example.com",
         password="Test1234!"
    )
    user = controller.get_user(db_session, user_id=new_user.id)
    assert user.username == "testuser"
    assert user.email == "test@example.com"

# Test: Obtener todos los usuarios
def test_get_users(db_session):
    controller = UserController(db_session)
    controller.insert_user(
        db=db_session, username="user1", email="user1@example.com", password="Test1234!"
    )
    controller.insert_user(
        db=db_session, username="user2", email="user2@example.com", password="Test5678!"
    )
    users = controller.get_users(db_session)
    assert len(users) == 2

# Test: Verificar contraseñas
def test_verify_password():
    hashed_password = UserController.pwd_context.hash("Test1234!")
    assert UserController.verify_password("Test1234!", hashed_password) is True
    assert UserController.verify_password("WrongPassword", hashed_password) is False

# Test: Crear un token de acceso
def test_create_access_token():
    data = {"sub": "testuser"}
    token = UserController.create_access_token(data)
    assert isinstance(token, str)

# Test: Crear un token de refresco
def test_create_refresh_token():
    data = {"sub": "testuser"}
    token = UserController.create_refresh_token(data)
    assert isinstance(token, str)
    """
