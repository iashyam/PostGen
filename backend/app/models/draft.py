from datetime import datetime

from pydantic import BaseModel, Field


class DraftCreate(BaseModel):
    title: str = ""
    content: str = ""
    plain_text: str = ""
    topic: str = ""
    key_points: list[str] = []
    tone: str = "Professional"
    length: str = "Medium"
    image_urls: list[str] = []
    selected_image_url: str | None = None


class DraftUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    plain_text: str | None = None
    topic: str | None = None
    key_points: list[str] | None = None
    tone: str | None = None
    length: str | None = None
    image_urls: list[str] | None = None
    selected_image_url: str | None = None


class DraftResponse(BaseModel):
    id: str = Field(alias="_id")
    user_id: str | None = None
    title: str = ""
    content: str = ""
    plain_text: str = ""
    topic: str = ""
    key_points: list[str] = []
    tone: str = "Professional"
    length: str = "Medium"
    image_urls: list[str] = []
    selected_image_url: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"populate_by_name": True}
