# ShiftFlow Backend (MVP)

Node.js + Express + Neon Postgres, MVC + Service Layer architecture, ES Modules (`import`/`export`) throughout.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```
   cp .env.example .env
   ```
   - `DATABASE_URL` — your Neon connection string
   - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — any long random strings

3. Run the schema SQL (`shiftflow_schema.sql`) in the Neon SQL Editor if not already done.

4. Start the dev server:
   ```
   npm run dev
   ```

5. Visit `http://localhost:5000/health` — should return `{ success: true, message: "ShiftFlow API is running" }`

## Architecture

```
Route -> Middleware (auth/validation) -> Controller -> Service -> Model -> Database
```

- **Routes**: URL → controller mapping only
- **Controllers**: handle req/res, no business logic
- **Services**: business logic lives here
- **Models**: raw database queries only

## What's built so far

- ✅ Auth module (register, login) — full template: model → service → controller → route
- 🔲 Store & Staff module
- 🔲 Shift module
- 🔲 Swap module
- 🔲 Time-off module
- 🔲 Attendance module
- 🔲 Notification module

## Testing the Auth endpoints

**Register:**
```
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "email": "owner@store.com",
  "password": "SecurePass123!",
  "fullName": "Alex Rivera",
  "storeName": "Riverside Apparel"
}
```

**Login:**
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "owner@store.com",
  "password": "SecurePass123!"
}
```
