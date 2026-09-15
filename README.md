# ShiftFlow

Shift management platform built as a monorepo with npm workspaces.

## Project Structure

```
shiftflow/
├── packages/
│   ├── backend/          # Express + Neon Postgres API
│   └── frontend/         # Next.js + Tailwind UI
├── package.json          # Root workspace config
└── README.md
```

## Setup

1. Install all dependencies from root:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp packages/backend/.env.example packages/backend/.env
   cp packages/frontend/.env.local.example packages/frontend/.env.local
   ```

3. Run the schema SQL (`packages/backend/shiftflow_schema.sql`) in Neon SQL Editor.

## Development

Run both frontend and backend:
```bash
npm run dev
```

Run individually:
```bash
npm run dev:backend
npm run dev:frontend
```

## Backend Architecture

```
Route -> Middleware (auth/validation) -> Controller -> Service -> Model -> Database
```

- **Routes**: URL → controller mapping only
- **Controllers**: handle req/res, no business logic
- **Services**: business logic lives here
- **Models**: raw database queries only

### What's Built

- ✅ **Auth** — register (creates owner + store), login, refresh token
- ✅ **Store & Staff** — CRUD store, invite staff by phone, update staff
- ✅ **Shifts** — create draft shifts, publish week, overlap detection
- ✅ **Swaps** — request/accept/approve/reject, state machine workflow
- ✅ **Time-off** — request/list/approve/deny, overlap detection
- ✅ **Attendance** — clock in/out, variance tracking, CSV export
- ✅ **Notifications** — in-app + email, wired to shifts, swaps, time-off
- ✅ **AI assistant** — Google Gemini-powered chat with schedule context
- ✅ **Input validation** — Zod schemas on all mutation endpoints
- ✅ **Store-scoping** — staff can only access their own store data

### Security

- JWT auth (15min access / 7d refresh tokens)
- Role-based access control (owner, manager, staff)
- Store-scoping middleware
- Zod input validation
- Bcrypt password hashing (10 rounds)

### API Endpoints

Base URL: `/api/v1`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| **Auth** | | | |
| POST | `/auth/register` | No | Register owner + create store |
| POST | `/auth/login` | No | Login, get tokens |
| POST | `/auth/refresh` | No | Refresh access token |
| **Stores** | | | |
| GET | `/stores/:storeId` | Yes | Get store details |
| PATCH | `/stores/:storeId` | Yes | Update store (owner/manager) |
| GET | `/stores/:storeId/staff` | Yes | List staff |
| POST | `/stores/:storeId/staff/invite` | Yes | Invite staff (owner/manager) |
| PATCH | `/stores/:storeId/staff/:staffId` | Yes | Update staff (owner/manager) |
| **Shifts** | | | |
| POST | `/stores/:storeId/shifts` | Yes | Create draft shift |
| GET | `/stores/:storeId/shifts` | Yes | Get week schedule |
| POST | `/stores/:storeId/shifts/publish` | Yes | Publish week |
| PATCH | `/shifts/:shiftId` | Yes | Update shift |
| DELETE | `/shifts/:shiftId` | Yes | Delete shift |
| **Swaps** | | | |
| POST | `/shifts/:shiftId/swap-request` | Yes | Request swap |
| GET | `/stores/:storeId/swap-requests` | Yes | List swaps |
| POST | `/swap-requests/:swapId/accept` | Yes | Accept swap |
| POST | `/swap-requests/:swapId/approve` | Yes | Approve (manager) |
| POST | `/swap-requests/:swapId/reject` | Yes | Reject (manager) |
| **Time Off** | | | |
| POST | `/stores/:storeId/time-off` | Yes | Request time off |
| GET | `/stores/:storeId/time-off` | Yes | List requests |
| PATCH | `/time-off/:requestId/approve` | Yes | Approve (manager) |
| PATCH | `/time-off/:requestId/deny` | Yes | Deny (manager) |
| **Attendance** | | | |
| POST | `/attendance/clock-in` | Yes | Clock in |
| POST | `/attendance/clock-out` | Yes | Clock out |
| GET | `/stores/:storeId/attendance` | Yes | List records |
| GET | `/stores/:storeId/attendance/export` | Yes | Export CSV (manager) |
| **Notifications** | | | |
| GET | `/notifications` | Yes | List notifications |
| PATCH | `/notifications/:notificationId/read` | Yes | Mark read |
| **AI** | | | |
| POST | `/ai/chat` | Yes | Chat with AI assistant |

## Frontend

- Next.js 15 + React 18
- Tailwind CSS
