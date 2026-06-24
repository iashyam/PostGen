from datetime import datetime

from pydantic import BaseModel, Field


class UserResponse(BaseModel):
    id: str = Field(alias="_id")
    linkedin_id: str
    name: str
    email: str
    avatar_url: str = ""
    settings: dict = {}
    created_at: datetime

    model_config = {"populate_by_name": True}
