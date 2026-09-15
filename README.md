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

## Packages

### Backend (`packages/backend`)
- Node.js + Express + Neon Postgres
- MVC + Service Layer architecture
- ES Modules (`import`/`export`)

### Frontend (`packages/frontend`)
- Next.js 15 + React 18
- Tailwind CSS
