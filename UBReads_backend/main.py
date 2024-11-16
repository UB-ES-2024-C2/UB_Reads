from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.models import create_tables,reset_database
from app.routers.user_router import router as user_router
from app.routers.book_router import router as book_router
from app.routers.book_user_router import router as book_user_router
app = FastAPI()

reset_database()
create_tables()

app.include_router(book_router)
app.include_router(user_router)
app.include_router(book_user_router)

origins = [
    "http://localhost",
    "http://localhost:5173",
]

# Allow requests from the frontend (port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "Hello from FastAPI!"}
