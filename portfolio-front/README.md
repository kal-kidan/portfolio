# Portfolio Frontend

React + Vite SPA scaffold (structure aligned with Pitch-AI). Feature folders under `src/features/` are placeholders.

## Environment

Copy `.env.example` to `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

For Vercel production builds, set `VITE_API_BASE_URL` in `vercel.json` or the Vercel dashboard.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite dev server (`http://localhost:5173`) |
| `npm run build` | Production build → `dist/` |
| `npm run deploy:vercel` | Deploy to Vercel (`vercel --prod`) |

## Folder layout

```text
src/
├── app/           # App shell & routes
├── components/    # Shared UI
├── contexts/      # React contexts
├── features/      # Feature modules (empty placeholders)
├── hooks/
├── lib/           # axios, react-query
├── socket/        # Socket.IO client (placeholder)
└── utils/
```
