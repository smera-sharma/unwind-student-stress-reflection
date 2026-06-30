from pydantic import BaseModel, EmailStr
from typing import Optional

# Shared user properties
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    is_active: Optional[bool] = True

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str

# Properties to return via API
class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True
