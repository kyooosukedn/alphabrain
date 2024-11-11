from pydantic import BaseModel, Field
from bson import ObjectId
from typing import Optional

class UserModel(BaseModel):
    id: Optional[str] = Field(default_factory=str, alias="_id")
    username: str
    password: str  