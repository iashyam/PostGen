from datetime import datetime, timedelta, timezone

from jose import jwt

from app.config import settings

ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 24


def create_jwt(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HOURS)
    payload = {"sub": user_id, "exp": expire}
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)


def decode_jwt(token: str) -> dict:
    return jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
