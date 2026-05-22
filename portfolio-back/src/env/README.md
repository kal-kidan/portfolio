# Environment files

| File | Purpose |
|------|---------|
| `env.example` | Committed template — copy and rename |
| `env.development` | Local dev (gitignored) |
| `env.production` | Production secrets (gitignored); source for `pnpm cloudrun:env` |
| `credentials/` | GCP or OAuth JSON keys (gitignored) |

Do not commit real secrets. For Cloud Run, run `pnpm cloudrun:env` to generate `cloudrun.env.yaml` at the package root.
