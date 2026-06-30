from pydantic import BaseModel
from typing import Optional

# Schema returned on successful login
class Token(BaseModel):
    access_token: str
    token_type: str

# Schema representing JWT claim payload checks
class TokenPayload(BaseModel):
    sub: Optional[str] = None
