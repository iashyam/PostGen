from typing import Annotated

from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import settings

client: AsyncIOMotorClient | None = None
db: AsyncIOMotorDatabase | None = None


async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.mongodb_uri)
    db = client[settings.mongodb_db]

    # Create indexes
    await db.drafts.create_index([("user_id", 1), ("updated_at", -1)])
    await db.posts_history.create_index([("user_id", 1), ("posted_at", -1)])
    await db.users.create_index("linkedin_id", unique=True, sparse=True)
    await db.refresh_tokens.create_index("token", unique=True)
    await db.refresh_tokens.create_index("expires_at", expireAfterSeconds=0)


async def close_db():
    global client
    if client:
        client.close()


def get_db() -> AsyncIOMotorDatabase:
    return db


DB = Annotated[AsyncIOMotorDatabase, Depends(get_db)]
