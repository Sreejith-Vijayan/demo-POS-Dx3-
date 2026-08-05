# Cafe ERP & POS System

Production-ready **foundation / skeleton** for a multi-role Café ERP & POS platform (Petpooja / Toast / Square style).

This repo is intentionally **not** a full POS yet. It provides architecture, routing, RBAC, API placeholders, models, and runnable UI shells so features can be implemented module-by-module.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React, TypeScript, Vite, Tailwind CSS v4, React Router, TanStack Query, React Hook Form, Zod, Axios, Lucide |
| Backend | Python, FastAPI, SQLAlchemy, Pydantic, Alembic |
| DB | PostgreSQL (Docker) or SQLite (local demo) |
| Auth | JWT-ready RBAC — **demo uses Role Selection + `X-User-Role` header** (no login) |

## Quick start (local)

### Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- API docs: http://localhost:8000/docs  
- Health: http://localhost:8000/health  
- SQLite DB auto-created + seeded on startup (`USE_SQLITE=true` by default)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

- App: http://localhost:5173  
- Vite proxies `/api` → `http://localhost:8000`

Open the app → **select a role** → navigate via the sidebar.

## Docker

```bash
docker compose up --build
```

Services:

- Frontend: http://localhost:5173  
- Backend: http://localhost:8000  
- Postgres: localhost:5432 (`cafe_user` / `cafe_pass` / `cafe_erp`)

## Roles & permissions

| Role | Can access (examples) |
|------|------------------------|
| Administrator | Full access |
| Manager | Dashboard, reports, inventory, employees, customers |
| Captain | Tables, orders, KOT send |
| Kitchen | KOT board, status updates |
| Cashier | Billing, payments, receipts |
| Customer | QR menu, feedback |

Frontend stores the selected role in `localStorage` and sends `X-User-Role` on every API call. Backend `require_permissions(...)` dependencies enforce the same matrix.

## Project layout

```
frontend/src/
  app/ layouts/ pages/ components/ features/ hooks/
  services/ api/ context/ store/ utils/ routes/

backend/app/
  api/v1/{auth,dashboard,captain,cashier,kitchen,menu,...}
  core/ database/ middleware/ repositories/ services/
  schemas/ models/ permissions/ seeds/ config/
```

## API surface (v1)

Examples (all under `/api/v1`, require `X-User-Role`):

- `GET /menu`, `GET /menu/categories`
- `GET|POST /orders`, `PUT|DELETE /orders/{id}`
- `GET /kitchen/orders`, `PUT /kitchen/status/{id}`
- `GET /dashboard`, `GET /inventory`
- `POST /cashier/payments`, `GET /customers`
- `GET /reports/sales`, `GET /settings`

Business logic is stubbed with `TODO` comments.

## Next phases (not in this skeleton)

1. JWT login / refresh tokens  
2. Full order → KOT → billing workflow  
3. Inventory consumption on sale  
4. Printer / payment gateway integrations  
5. AI modules (demand forecast, menu suggestions)

## License

Private / demo — adjust as needed.
