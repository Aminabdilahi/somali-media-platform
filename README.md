# Somali AI Media Platform — Phase 1 foundation

Phase 1 establishes organization bootstrap, authenticated users, role-based access, persistent task records, audit events, organization settings, a provider integration boundary, and a Next.js desk. It does **not** yet discover news, research sources, verify claims, write or translate articles, collaborate on drafts, schedule, publish, or archive content. Agent entries shown in the UI are roadmap metadata, not functioning agents.

## Run locally

1. Copy `.env.example` to `.env` and set unique `SECRET_KEY` and `FERNET_KEY` values. `make keys` prints secure values. Set `ANTHROPIC_API_KEY` to enable the real provider connection test (or save an organization key in Settings).
2. Run `make up` (Docker Compose starts PostgreSQL with pgvector, Redis, the API, and web UI).
3. Open `http://localhost:3000`; first setup creates the organization and its first administrator. API documentation is at `http://localhost:8000/docs`.
4. Run `make test` for the backend suite; `make migrate` applies migrations.

The checked-in `.env.example` contains no working secrets. Do not commit `.env`. For hosted deployment, use HTTPS and set `COOKIE_SECURE=true`; use managed databases/cache and rotate application and encryption keys through an explicit migration plan.

## Architecture and data model

The web client calls same-origin `/api/*` routes, which Next.js rewrites to FastAPI. FastAPI owns authentication, authorization, validation, business rules, provider orchestration, and persistence. SQLAlchemy models and Alembic migrations define the PostgreSQL schema; Redis backs request limits in Compose. The Anthropic adapter implements a vendor-neutral `LLMProvider` interface. Organization API keys are Fernet-encrypted at rest, masked in responses, and excluded from audit detail.

See [`docs/architecture.md`](docs/architecture.md) for the schema, API contracts, agent extension design, and folder map.

## Security boundaries and known scope

Passwords are bcrypt-hashed; the API sets an HTTP-only, SameSite=Lax JWT cookie and checks roles and active-user state on protected routes. Data access is organization-scoped. Secrets are required from the environment at API startup. This foundation still needs CSRF defenses beyond SameSite, account recovery and lockout, production deployment hardening, backups, and security review before public deployment. It has no publication capability, so editorial approval and publishing controls must be implemented before any future publish integration.

## Extending providers

Implement `LLMProvider` in `backend/app/ai/providers/`, register its factory in `backend/app/ai/registry.py`, and define configuration resolution in `backend/app/services/llm.py`. Embeddings use the distinct `EmbeddingProvider` contract; choose and evaluate a Somali-capable embedding model before adding retrieval.
