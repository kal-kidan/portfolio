# Portfolio

Scaffold monorepo-style layout (two sibling apps, no root workspace tooling), mirroring the [Pitch-AI](https://github.com) project structure for frontend and backend.

## Repository layout

```text
portfolio/
├── portfolio-front/     # React + Vite SPA (npm, Vercel)
└── portfolio-back/      # NestJS API (pnpm, Docker / Cloud Run)
```

## Tech stack

| Package | Stack |
|---------|--------|
| **portfolio-front** | React 19, TypeScript, Vite 7, React Router, TanStack Query, Axios, Tailwind CSS v4, ESLint |
| **portfolio-back** | NestJS 10, MongoDB + Mongoose, Winston, class-validator, Jest |

Feature modules under `portfolio-back/src/modules/` and `portfolio-front/src/features/` are **placeholders** — add implementations as needed.

## Running locally

### Backend

1. Copy `portfolio-back/src/env/env.example` to `src/env/env.development` and fill in values.
2. Start MongoDB (local or `docker compose up mongo` from `portfolio-back`).
3. From `portfolio-back`:

```bash
pnpm install
pnpm start:dev
```

API defaults to `http://localhost:3000` in development (`app.config.ts`).

### Frontend

1. Copy `portfolio-front/.env.example` to `.env` and set `VITE_API_BASE_URL`.
2. From `portfolio-front`:

```bash
npm install
npm run dev
```

Vite dev server: `http://localhost:5173`.

## Deployment

| App | Target | Command |
|-----|--------|---------|
| Frontend | Vercel | `npm run deploy:vercel` (configure project + `vercel.json` URLs first) |
| Backend | Google Cloud Run | `pnpm deploy:cloudrun` (set GCP project/image in `package.json` scripts) |

See each package README for env and deploy details.
