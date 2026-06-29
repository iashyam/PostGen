.PHONY: install install-backend install-frontend dev dev-backend dev-frontend build clean lint

# ── Install ──────────────────────────────────────────
install: install-backend install-frontend

install-backend:
	@cd backend && \
	if [ ! -d ".venv" ]; then \
		echo "No virtual env found. Creating with uv..."; \
		uv venv; \
	fi; \
	. .venv/bin/activate && uv pip install -r requirements.txt

install-frontend:
	cd frontend && yarn install

# ── Development ──────────────────────────────────────
dev:
	@echo "Starting backend and frontend..."
	$(MAKE) dev-backend &
	$(MAKE) dev-frontend &
	wait

dev-backend:
	cd backend && . .venv/bin/activate && uvicorn app.main:app --reload --port 8000

dev-frontend:
	cd frontend && yarn dev

# ── Build ────────────────────────────────────────────
build:
	cd frontend && yarn build

# ── Lint / Check ─────────────────────────────────────
lint:
	cd frontend && yarn tsc --noEmit

# ── Setup ────────────────────────────────────────────
setup: install
	@test -f backend/.env || cp backend/.env.example backend/.env
	@echo "Done. Fill in backend/.env with your API keys."

# ── Clean ────────────────────────────────────────────
clean:
	rm -rf frontend/.next frontend/node_modules backend/__pycache__
	find backend -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
