from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings

client: AsyncIOMotorClient = None
db = None


async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.mongodb_uri)
    db = client[settings.mongodb_db]

    # Create indexes
    await db.drafts.create_index([("user_id", 1), ("updated_at", -1)])
    await db.posts_history.create_index([("user_id", 1), ("posted_at", -1)])
    await db.users.create_index("linkedin_id", unique=True, sparse=True)


async def close_db():
    global client
    if client:
        client.close()


def get_db():
    return db
