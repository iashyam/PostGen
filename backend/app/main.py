from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import close_db, connect_db
from app.routers import auth, drafts, generate, history, linkedin, settings as settings_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(title="PostGen", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router, prefix="/api", tags=["generate"])
app.include_router(drafts.router, prefix="/api", tags=["drafts"])
app.include_router(history.router, prefix="/api", tags=["history"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(linkedin.router, prefix="/api", tags=["linkedin"])
app.include_router(settings_router.router, prefix="/api", tags=["settings"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}
