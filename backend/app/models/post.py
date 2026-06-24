from datetime import datetime

from pydantic import BaseModel, Field


class GeneratePostRequest(BaseModel):
    topic: str = Field(max_length=300)
    key_points: list[str] = []
    tone: str = "Professional"
    length: str = "Medium"


class GenerateImageRequest(BaseModel):
    topic: str
    style: str = "Modern 3D"
    post_summary: str = ""


class ImageResponse(BaseModel):
    url: str
    thumbnail_url: str


class PostHistoryResponse(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    content: str
    plain_text: str = ""
    image_url: str | None = None
    linkedin_post_id: str | None = None
    topic: str = ""
    tone: str = ""
    length: str = ""
    posted_at: datetime
    platform: str = "linkedin"
    engagement: dict = {}

    model_config = {"populate_by_name": True}
