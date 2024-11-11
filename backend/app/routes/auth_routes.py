from fastapi import APIRouter, Depends, HTTPException, status
from app.models import db
from app.schemas.auth_schema import SignInSchema, LoginSchema
from app.services.auth_service import hash_password, verify_password, create_access_token

auth_router = APIRouter()

@auth_router.post("/sign-in")
async def sign_in(user_data: SignInSchema):
    user_collection = db["users"]
    if user_collection.find_one({"username": user_data.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed_password = hash_password(user_data.password)
    user_collection.insert_one({"username": user_data.username, "password": hashed_password})
    return {"msg": "User created successfully"}

@auth_router.post("/login")
async def login(user_data: LoginSchema):
    user_collection = db["users"]
    user = user_collection.find_one({"username": user_data.username})

    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user_data.username})
    return {"access_token": access_token, "token_type": "bearer"}