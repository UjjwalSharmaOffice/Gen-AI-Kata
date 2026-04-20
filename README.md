# Office Supply Management System

A production-grade full-stack application for managing office supply requests, approvals, and inventory tracking.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Backend | Node.js + Express + TypeScript |
| Database | SQLite (via Prisma ORM) |
| Auth | JWT (Bearer token) |
| Validation | Zod (API) |
| Testing | Jest + Supertest |

## Quick Start

### Prerequisites
- Node.js 18+

### 1. Setup Backend

```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Backend runs at: `http://localhost:4000`

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@office.local | admin123 |
| Employee | employee@office.local | employee123 |

## Features

### Employee
- Submit supply requests with item + quantity + optional remarks
- View own request history with status tracking

### Admin
- Manage inventory (create, view, delete items)
- View all supply requests
- Approve requests (auto-deducts stock atomically)
- Reject requests with optional reason
- View full request history

## Approval Logic

- If item quantity is sufficient → **APPROVED** + inventory deducted atomically
- If item quantity insufficient → returns `409 Conflict` error
- Admin must explicitly reject manually; rejection includes an optional reason field

## API Reference

Base: `http://localhost:4000/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /auth/login | Public | Login |
| GET | /health | Public | Health check |
| GET | /inventory | Any | List items |
| POST | /inventory | Admin | Create item |
| PUT | /inventory/:id | Admin | Update item |
| DELETE | /inventory/:id | Admin | Remove item |
| POST | /requests | Employee | Submit request |
| GET | /requests | Any | List requests (role-scoped) |
| POST | /requests/:id/approve | Admin | Approve request |
| POST | /requests/:id/reject | Admin | Reject request |
| GET | /history | Admin | Full request history |

## Running Tests

```bash
cd backend
npx jest --config jest.config.json --runInBand
```

## Project Structure

```
supplychain/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── seed.ts            # Seed users + inventory
│   │   └── dev.db             # SQLite database
│   ├── src/
│   │   ├── config/            # Environment config
│   │   ├── common/
│   │   │   ├── middleware/    # Auth, validation, error handling
│   │   │   └── utils/         # JWT, Prisma client
│   │   ├── modules/
│   │   │   ├── auth/          # Login + JWT
│   │   │   ├── inventory/     # CRUD inventory items
│   │   │   ├── requests/      # Request creation + approval workflow
│   │   │   └── history/       # Full audit history
│   │   ├── routes/            # Router composition
│   │   ├── app.ts             # Express app factory
│   │   └── server.ts          # Entry point
│   └── tests/                 # Jest + Supertest test suites
└── frontend/
    └── src/
        ├── api/               # Axios client
        ├── auth/              # AuthProvider + ProtectedRoute
        ├── components/        # Layout
        ├── pages/
        │   ├── admin/         # Inventory, Requests, History
        │   └── employee/      # New Request, My Requests
        └── types/             # Shared model types
```