from bson import ObjectId
from fastapi import APIRouter, HTTPException

from app.database import get_db
from app.models.settings import UserSettings

router = APIRouter()


@router.get("/settings/{user_id}", response_model=UserSettings)
async def get_settings(user_id: str):
    db = get_db()
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserSettings(**user.get("settings", {}))


@router.put("/settings/{user_id}", response_model=UserSettings)
async def update_settings(user_id: str, user_settings: UserSettings):
    db = get_db()
    result = await db.users.find_one_and_update(
        {"_id": ObjectId(user_id)},
        {"$set": {"settings": user_settings.model_dump()}},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return UserSettings(**result.get("settings", {}))
