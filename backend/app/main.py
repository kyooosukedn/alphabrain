from fastapi import FastAPI
from app.routes.auth_routes import auth_router

app = FastAPI()

# Include authentication routes
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])