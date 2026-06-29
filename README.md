# PostGen

I have reacehd a point in my life where I want to vibe code an application for every task that bothers me. So this again is born from such urge. I have a lot of ideas that I want to post on linkedIn but I am very lazy to write those posts, generate image from Gemini and then upload them. So, I have made this app, so that I can just put my idea in messy words, it will craft a linkedIn post for you. 

This app should cost you, but I won't. If you have your own APIs, then go ahead and put your API keys and generate your images. There is no SaaS stuff going on here. 

## Tech Stack

**Frontend:** Next.js, TypeScript, Tailwind CSS v4, Zustand, TipTap editor

**Backend:** FastAPI, LangGraph, LangChain + Google Gemini, Motor (async MongoDB), Pillow

**Infrastructure:** MongoDB, AWS S3 (image storage)

## Features

- AI post generation powered by Google Gemini via LangGraph
- Rich text editing with TipTap
- Draft management (save, edit, delete)
- Post history tracking
- LinkedIn OAuth integration for direct publishing
- Image generation and S3 storage
- Per-user settings and preferences

## Prerequisites

- Python 3.13+ and uv
- Node.js 18+ and Yarn
- Google API key (Gemini)
- AWS credentials (S3, for image storage)
- LinkedIn OAuth app (for publishing)

## Quick Start

```bash
# 1. Clone and setup
git clone https://github.com/iashyam/PostGen.git && cd PostGen
make setup

# 2. Configure environment
#    Edit backend/.env with your API keys

# 3. Start database + dev servers
make dev
```

Backend runs at `http://localhost:8000`, frontend at `http://localhost:3000`.

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

| Variable | Description |
|---|---|
| `GOOGLE_API_KEY` | Google AI / Gemini API key |
| `GEMINI_MODEL` | Model name (default: `gemini-2.0-flash`) |
| `MONGODB_URI` | MongoDB connection string |
| `AWS_ACCESS_KEY_ID` | AWS access key for S3 |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `S3_BUCKET` | S3 bucket name for images |
| `LINKEDIN_CLIENT_ID` | LinkedIn OAuth client ID |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn OAuth client secret |
| `SECRET_KEY` | JWT signing secret |

## Make Commands

| Command | Description |
|---|---|
| `make setup` | Install deps + create `.env` from example |
| `make dev` | Start backend and frontend |
| `make dev-backend` | Start backend only |
| `make dev-frontend` | Start frontend only |
| `make build` | Build frontend for production |
| `make lint` | Run TypeScript type check |
| `make clean` | Remove build artifacts and caches |

## Project Structure

```
PostGen/
├── backend/
│   └── app/
│       ├── main.py              # FastAPI app entrypoint
│       ├── config.py            # Pydantic settings
│       ├── database.py          # MongoDB connection
│       ├── models/              # Pydantic models (user, post, draft, settings)
│       ├── routers/             # API routes (auth, generate, drafts, history, linkedin, settings)
│       ├── services/            # Business logic (langgraph_chain, linkedin, s3, image)
│       └── utils/
├── frontend/
│   └── src/
│       ├── pages/               # CreatePost, Drafts, History, Settings
│       ├── components/          # UI components by feature
│       ├── store/               # Zustand state management
│       ├── api/                 # API client
│       ├── hooks/
│       └── types/
├── docker-compose.yml
└── Makefile
```

## API

Health check: `GET /api/health`

Core endpoints under `/api`:
- `POST /generate` — AI post generation
- `GET/POST/PUT/DELETE /drafts` — Draft CRUD
- `GET /history` — Post history
- `POST /linkedin/publish` — Publish to LinkedIn
- `GET/PUT /settings` — User settings

Auth endpoints under `/api/auth`:
- LinkedIn OAuth flow

## License

MIT
