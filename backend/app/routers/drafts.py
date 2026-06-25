from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, HTTPException

from app.database import DB
from app.models.draft import DraftCreate, DraftResponse, DraftUpdate

router = APIRouter()


@router.get("/drafts", response_model=list[DraftResponse])
async def list_drafts(db: DB, page: int = 1, limit: int = 20):
    skip = (page - 1) * limit
    cursor = db.drafts.find().sort("updated_at", -1).skip(skip).limit(limit)
    drafts = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        drafts.append(doc)
    return drafts


@router.post("/drafts", response_model=DraftResponse)
async def create_draft(db: DB, draft: DraftCreate):
    now = datetime.now(timezone.utc)
    doc = {**draft.model_dump(), "user_id": None, "created_at": now, "updated_at": now}
    result = await db.drafts.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


@router.get("/drafts/{draft_id}", response_model=DraftResponse)
async def get_draft(db: DB, draft_id: str):
    doc = await db.drafts.find_one({"_id": ObjectId(draft_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Draft not found")
    doc["_id"] = str(doc["_id"])
    return doc


@router.put("/drafts/{draft_id}", response_model=DraftResponse)
async def update_draft(db: DB, draft_id: str, draft: DraftUpdate):
    update_data = {k: v for k, v in draft.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    result = await db.drafts.find_one_and_update(
        {"_id": ObjectId(draft_id)},
        {"$set": update_data},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Draft not found")
    result["_id"] = str(result["_id"])
    return result


@router.delete("/drafts/{draft_id}")
async def delete_draft(db: DB, draft_id: str):
    result = await db.drafts.delete_one({"_id": ObjectId(draft_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Draft not found")
    return {"deleted": True}
