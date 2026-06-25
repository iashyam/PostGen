import secrets
from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, Cookie, HTTPException, Response

from app.config import settings
from app.database import DB
from app.utils.auth import create_access_token, generate_refresh_token, refresh_token_expiry

router = APIRouter()

LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization"
LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken"
LINKEDIN_USERINFO_URL = "https://api.linkedin.com/v2/userinfo"

# In-memory state store (use Redis in production)
_oauth_states: dict[str, bool] = {}


@router.get("/linkedin")
async def linkedin_auth():
    state = secrets.token_urlsafe(32)
    _oauth_states[state] = True
    params = {
        "response_type": "code",
        "client_id": settings.linkedin_client_id,
        "redirect_uri": settings.linkedin_redirect_uri,
        "state": state,
        "scope": "openid profile email w_member_social",
    }
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return {"auth_url": f"{LINKEDIN_AUTH_URL}?{query}"}


@router.get("/linkedin/callback")
async def linkedin_callback(db: DB, code: str, state: str, response: Response):
    if state not in _oauth_states:
        raise HTTPException(status_code=400, detail="Invalid state parameter")
    del _oauth_states[state]

    async with httpx.AsyncClient() as http_client:
        # Exchange code for token
        token_resp = await http_client.post(
            LINKEDIN_TOKEN_URL,
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": settings.linkedin_redirect_uri,
                "client_id": settings.linkedin_client_id,
                "client_secret": settings.linkedin_client_secret,
            },
        )
        if token_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to exchange code for token")
        token_data = token_resp.json()

        # Fetch user profile
        profile_resp = await http_client.get(
            LINKEDIN_USERINFO_URL,
            headers={"Authorization": f"Bearer {token_data['access_token']}"},
        )
        if profile_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch profile")
        profile = profile_resp.json()
    now = datetime.now(timezone.utc)
    user_doc = await db.users.find_one_and_update(
        {"linkedin_id": profile["sub"]},
        {
            "$set": {
                "name": profile.get("name", ""),
                "email": profile.get("email", ""),
                "avatar_url": profile.get("picture", ""),
                "linkedin_access_token": token_data["access_token"],
                "token_expires_at": now,
                "updated_at": now,
            },
            "$setOnInsert": {
                "linkedin_id": profile["sub"],
                "settings": {},
                "created_at": now,
            },
        },
        upsert=True,
        return_document=True,
    )

    user_id = str(user_doc["_id"])
    access_token = create_access_token(user_id)

    # Create and store refresh token
    refresh_token = generate_refresh_token()
    await db.refresh_tokens.insert_one({
        "token": refresh_token,
        "user_id": user_id,
        "expires_at": refresh_token_expiry(),
        "created_at": now,
    })

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=30 * 24 * 60 * 60,  # 30 days
        path="/api/auth",
    )

    return {"token": access_token, "user": {"name": user_doc["name"], "avatar_url": user_doc.get("avatar_url", "")}}


@router.post("/refresh")
async def refresh(db: DB, response: Response, refresh_token: str | None = Cookie(default=None)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token")

    # Find and validate refresh token
    token_doc = await db.refresh_tokens.find_one({"token": refresh_token})
    if not token_doc:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    if token_doc["expires_at"] < datetime.now(timezone.utc):
        await db.refresh_tokens.delete_one({"_id": token_doc["_id"]})
        raise HTTPException(status_code=401, detail="Refresh token expired")

    # Rotate refresh token
    await db.refresh_tokens.delete_one({"_id": token_doc["_id"]})
    new_refresh_token = generate_refresh_token()
    now = datetime.now(timezone.utc)
    await db.refresh_tokens.insert_one({
        "token": new_refresh_token,
        "user_id": token_doc["user_id"],
        "expires_at": refresh_token_expiry(),
        "created_at": now,
    })

    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=30 * 24 * 60 * 60,
        path="/api/auth",
    )

    access_token = create_access_token(token_doc["user_id"])
    return {"token": access_token}


@router.post("/logout")
async def logout(db: DB, response: Response, refresh_token: str | None = Cookie(default=None)):
    if refresh_token:
        await db.refresh_tokens.delete_one({"token": refresh_token})

    response.delete_cookie(key="refresh_token", path="/api/auth")
    return {"ok": True}
