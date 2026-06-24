from pydantic import BaseModel


class UserSettings(BaseModel):
    default_tone: str = "Professional"
    default_length: str = "Medium"
    default_image_style: str = "Modern 3D"
    auto_hashtags: bool = True
    hashtag_count: int = 5
