from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.database import get_db
from app.services.linkedin_service import post_to_linkedin

router = APIRouter()


class LinkedInPostRequest(BaseModel):
    content: str
    image_url: str | None = None
    user_id: str = ""


@router.post("/post/linkedin")
async def create_linkedin_post(request: LinkedInPostRequest):
    db = get_db()
    user = await db.users.find_one({"_id": ObjectId(request.user_id)})
    if not user or not user.get("linkedin_access_token"):
        raise HTTPException(status_code=401, detail="LinkedIn not connected")

    result = await post_to_linkedin(
        access_token=user["linkedin_access_token"],
        linkedin_id=user["linkedin_id"],
        content=request.content,
        image_url=request.image_url,
    )

    # Save to history
    now = datetime.now(timezone.utc)
    await db.posts_history.insert_one(
        {
            "user_id": request.user_id,
            "content": request.content,
            "image_url": request.image_url,
            "linkedin_post_id": result.get("post_id"),
            "topic": "",
            "tone": "",
            "length": "",
            "posted_at": now,
            "platform": "linkedin",
            "engagement": {},
        }
    )

    return result
