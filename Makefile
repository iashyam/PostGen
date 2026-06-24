.PHONY: install install-backend install-frontend dev dev-backend dev-frontend db db-stop build clean lint

# ── Install ──────────────────────────────────────────
install: install-backend install-frontend

install-backend:
	cd backend && pip install -r requirements.txt

install-frontend:
	cd frontend && npm install

# ── Development ──────────────────────────────────────
dev: db
	@echo "Starting backend and frontend..."
	$(MAKE) dev-backend &
	$(MAKE) dev-frontend &
	wait

dev-backend:
	cd backend && uvicorn app.main:app --reload --port 8000

dev-frontend:
	cd frontend && npm run dev

# ── Database ─────────────────────────────────────────
db:
	docker compose up mongodb -d

db-stop:
	docker compose down

# ── Build ────────────────────────────────────────────
build:
	cd frontend && npm run build

# ── Docker (full stack) ──────────────────────────────
up:
	docker compose up -d

down:
	docker compose down

# ── Lint / Check ─────────────────────────────────────
lint:
	cd frontend && npx tsc --noEmit

# ── Setup ────────────────────────────────────────────
setup: install
	@test -f backend/.env || cp backend/.env.example backend/.env
	@echo "Done. Fill in backend/.env with your API keys."

# ── Clean ────────────────────────────────────────────
clean:
	rm -rf frontend/dist frontend/node_modules backend/__pycache__
	find backend -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
