from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

SQL_DATABASE_URL = "sqlite:///./database.db"

engine = create_engine(SQL_DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear las tablas
if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Tablas creadas exitosamente.")