# ShiftFlow Frontend (MVP)

Next.js (App Router) + Tailwind CSS. Connects to the ShiftFlow backend.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.local.example` to `.env.local`:
   ```
   cp .env.local.example .env.local
   ```
   Make sure `NEXT_PUBLIC_API_URL` points to your running backend (default: `http://localhost:5000/api/v1`).

3. Make sure the **backend is running** first (`npm run dev` in `shiftflow-backend`).

4. Start the frontend:
   ```
   npm run dev
   ```

5. Visit `http://localhost:3000` — it'll redirect you to `/login`.

## Login — MVP note

The login form asks for a **Store ID** field temporarily. This is because the MVP backend's login endpoint doesn't yet resolve "which store does this user belong to" — that's a natural next improvement (a `/auth/me` endpoint). For now, paste your store's UUID (from Neon's `stores` table, or from your registration response) into that field when logging in.

## Pages

| Route | Screen |
|---|---|
| `/login` | Login |
| `/schedule` | Weekly Schedule (core screen) |
| `/swap-requests` | Manage swap requests |
| `/time-off` | Time-off requests |
| `/attendance` | Attendance + CSV export |
| `/staff` | Staff list + invite |
| `/settings` | Account info |

## Structure

```
app/
  login/page.js          — public login page
  (dashboard)/            — protected routes, wrapped in Sidebar
    layout.js
    schedule/page.js
    swap-requests/page.js
    time-off/page.js
    attendance/page.js
    staff/page.js
    settings/page.js
lib/
  api.js                 — all backend API calls
  auth-context.js         — login state, token storage
components/
  Sidebar.js
  StatusPill.js
```

## Design system

Colors and fonts match the ShiftFlow Design Document (corporate/professional style):
- Primary: deep blue `#1E3A5F`
- Success/Warning/Danger status colors
- Inter font throughout

Defined in `tailwind.config.js`.
