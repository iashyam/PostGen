from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.database import DB
from app.services.linkedin_service import fetch_managed_pages, post_to_linkedin

router = APIRouter()


class LinkedInPostRequest(BaseModel):
    content: str
    image_url: str | None = None
    user_id: str = ""
    org_id: str | None = None


@router.post("/post/linkedin")
async def create_linkedin_post(db: DB, request: LinkedInPostRequest):
    user = await db.users.find_one({"_id": ObjectId(request.user_id)})
    if not user or not user.get("linkedin_access_token"):
        raise HTTPException(status_code=401, detail="LinkedIn not connected")

    result = await post_to_linkedin(
        access_token=user["linkedin_access_token"],
        linkedin_id=user["linkedin_id"],
        content=request.content,
        image_url=request.image_url,
        org_id=request.org_id,
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


@router.get("/pages/{user_id}")
async def list_managed_pages(db: DB, user_id: str):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user or not user.get("linkedin_access_token"):
        raise HTTPException(status_code=401, detail="LinkedIn not connected")

    pages = await fetch_managed_pages(user["linkedin_access_token"])
    return {"pages": pages}
