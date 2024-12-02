from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

#from app.core.database import create_tables
from app.routers.user_router import router as user_router
from app.routers.book_router import router as book_router
from app.routers.book_user_router import router as book_user_router

app = FastAPI()

#reset_database()
create_tables()

app.include_router(book_router)
app.include_router(user_router)
app.include_router(book_user_router)

# Configure CORS for development and production
origins = [
    "http://localhost",
    "http://localhost:5173", # Development frontend URL
    "https://<YOUR_PRODUCTION_URL>", # Production frontend URL
]

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
