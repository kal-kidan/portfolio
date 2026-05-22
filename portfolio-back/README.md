# Portfolio Backend

NestJS API scaffold (structure aligned with Pitch-AI). No feature modules are wired yet — only health checks and shared infrastructure.

## Environment

Copy `src/env/env.example` to:

- `src/env/env.development` — local dev (`pnpm start:dev`)
- `src/env/env.production` — production values (used by `pnpm cloudrun:env`)

Root `.env` is used by `docker-compose.yml`.

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm start:dev` | Watch mode |
| `pnpm build` | Compile to `dist/` |
| `pnpm cloudrun:env` | Generate `cloudrun.env.yaml` from `env.production` |
| `pnpm deploy:cloudrun` | Build image + deploy to Cloud Run (update GCP project in `package.json` first) |

## Docker

```bash
docker compose up --build
```

API: `http://localhost:8080` — health: `GET /` and `GET /health`.
