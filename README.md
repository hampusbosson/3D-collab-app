# Collab3D

Collab3D is a browser-based collaborative 3D scene editor built with:

- React + TypeScript + Vite
- ASP.NET Core Web API + SignalR
- Entity Framework Core
- PostgreSQL

## Run with Docker

From the project root:

```bash
docker compose up --build
```

Then open:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8080](http://localhost:8080)
- PostgreSQL: `localhost:5433`

## What Docker starts

- `frontend`
  - builds the Vite app
  - serves it through Nginx on port `3000`
- `backend`
  - runs the ASP.NET Core API on port `8080`
  - applies EF Core migrations automatically on startup
- `db`
  - runs PostgreSQL with:
    - database: `myappdb`
    - username: `postgres`
    - password: `postgres`

## Notes

- The frontend is configured for Docker through `frontend/.env.production`.
- The backend uses the Docker Compose database service name `db`, not `localhost`.
- SignalR is configured to connect through the backend container exposed on `http://localhost:8080`.

## Stop the app

```bash
docker compose down
```

If you also want to remove the PostgreSQL data volume:

```bash
docker compose down -v
```

## Quick verification

After startup, verify:

1. The dashboard loads at `http://localhost:3000`
2. Creating a scene redirects into the scene editor
3. The scene loads without backend/CORS errors in the browser console
4. Adding, transforming, recoloring, and deleting objects works
5. Real-time updates work across two browser windows
