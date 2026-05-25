# Troubleshooting: Companies Disappear After Refresh

## What’s happening
When the page refreshes, the frontend reloads the companies list from the backend (`GET /api/companies`). If the backend is down or can’t reach MongoDB Atlas, that request fails and the UI shows an empty list.

## 1) Check backend logs (local or Render)
Start the backend:

```bash
cd backend
npm start
```

Healthy logs look like:
- `Server listening on port 5000`
- `Connected to MongoDB`

If you see:
- `ERROR: MONGO_URI environment variable is not set!` → set `MONGO_URI` in `backend/.env` (local) or Render env vars (prod)
- `Database connection error: querySrv ETIMEOUT ...` → Atlas is not reachable (IP whitelist / DNS / cluster paused)

## 2) Verify MongoDB Atlas network access
In MongoDB Atlas:
- **Network Access** → add your current IP (for local) and/or allow all IPs (`0.0.0.0/0`) so Render can connect.

## 3) Verify health endpoint
Open `http://localhost:5000/health`.

`dbState` meanings (Mongoose):
- `1` = connected
- `0` = disconnected
- `2` = connecting
- `3` = disconnecting

## 4) Quick API test (local)
Create a company:

```bash
curl -X POST http://localhost:5000/api/companies ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test Company\",\"logoUrl\":\"https://example.com/logo.png\",\"description\":\"Test description for company\",\"location\":\"New York\",\"city\":\"New York\",\"foundedOn\":2020}"
```

Then list companies:

```bash
curl http://localhost:5000/api/companies
```

If the POST succeeds but the company doesn’t show up in GET, the backend is not writing to the same DB you expect (wrong URI/database) or the DB connection is unstable.

## Render + Vercel checklist
- Render backend has `MONGO_URI` set.
- MongoDB Atlas whitelist allows Render to connect.
- Frontend uses `VITE_API_BASE=https://<your-render-app>.onrender.com/api`.
