from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.models import create_tables, reset_database
from app.routers.user_router import router as user_router
from app.routers.book_router import router as book_router
from app.routers.book_user_router import router as book_user_router
import os

app = FastAPI()

# Resetear o crear las tablas en la base de datos
# RESET
reset_database()  # Solo si necesitas limpiar la base de datos
create_tables()
print("I WAS IN THE SERVER")

# Incluir rutas
app.include_router(book_router)
app.include_router(user_router)
app.include_router(book_user_router)

# Leer el entorno actual (desarrollo, preproducción o producción)
env_mode = os.getenv("ENV_MODE", "development")  # Por defecto, "development"

# Configurar los orígenes permitidos según el entorno
if env_mode == "development":  # Local
    origins = [
        "http://localhost:5173",  # URL del frontend local
    ]
elif env_mode == "preproduction":  # Preproducción
    origins = [
        "http://ubreads-dev-public-bucket.s3-website-eu-west-1.amazonaws.com",
    ]
elif env_mode == "production":  # Producción
    origins = [
        "http://ubreads-prod-public-bucket.s3-website-eu-west-1.amazonaws.com",
    ]
else:
    origins = []  # Si el entorno no está definido, ningún origen es permitido

print(f"Entorno actual: {env_mode}")
print(f"Orígenes permitidos: {origins}")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware para desactivar la caché
@app.middleware("http")
async def disable_cache(request: Request, call_next):
    response = await call_next(request)
    response.headers[
        "Cache-Control"
    ] = "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


@app.get("/")
async def read_root():
    return {"message": "Welcome to UBReads!"}
