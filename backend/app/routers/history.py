from fastapi import APIRouter

from app.database import DB
from app.models.post import PostHistoryResponse

router = APIRouter()


@router.get("/history", response_model=list[PostHistoryResponse])
async def list_history(db: DB, page: int = 1, limit: int = 20):
    skip = (page - 1) * limit
    cursor = db.posts_history.find().sort("posted_at", -1).skip(skip).limit(limit)
    posts = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        posts.append(doc)
    return posts
