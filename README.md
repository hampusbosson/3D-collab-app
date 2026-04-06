# Collab3D

Collab3D is a browser-based collaborative 3D scene editor where multiple users can create, edit, and manage objects in the same scene in real time.

This project was built to demonstrate full-stack product development across interactive UI, realtime communication, backend APIs, persistence, and deployment-ready infrastructure.

## Highlights

- Real-time collaborative editing with SignalR
- Shared scene presence and live selection indicators
- 3D object creation, transform controls, material editing, and deletion
- Undo/redo support for scene editing workflows
- Scene dashboard with live-rendered thumbnails
- Persistent PostgreSQL storage with Entity Framework Core migrations
- Docker-based local setup for frontend, backend, and database

## Tech Stack

- Frontend: React, TypeScript, Vite, React Three Fiber, Drei
- Backend: ASP.NET Core Web API, SignalR
- Data: PostgreSQL, Entity Framework Core
- Infrastructure: Docker, Docker Compose, Nginx

## What This Project Demonstrates

- Building an interactive 3D editor in the browser
- Synchronizing shared state across multiple connected clients
- Designing and exposing REST and realtime backend interfaces
- Managing persistent scene data with relational storage
- Shipping a full-stack app with containerized local development

## Core Features

### Scene Dashboard

- Create and delete scenes
- Search existing scenes
- View scene cards with actual rendered scene previews
- Open any saved scene directly from the dashboard

### Collaborative Scene Editor

- Add cubes, spheres, cylinders, cones, pyramids, and planes
- Move, rotate, and scale objects in 3D
- Change material color and opacity
- Rename scenes directly in the editor
- See other connected users in the same scene
- See which object another collaborator is currently selecting
- Undo and redo scene changes

## Project Structure

```text
frontend/     React + Vite client
backend/api/  ASP.NET Core API + SignalR hub
docker-compose.yml
```

## Run Locally With Docker

From the project root:

```bash
docker compose up --build
```

This starts:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8080](http://localhost:8080)
- PostgreSQL: `localhost:5433`

## Services

- `frontend`
  - Builds the Vite app
  - Serves the production build with Nginx on port `3000`
- `backend`
  - Runs the ASP.NET Core API on port `8080`
  - Applies EF Core migrations automatically on startup
- `db`
  - Runs PostgreSQL

Default Docker database settings:

- Database: `myappdb`
- Username: `postgres`
- Password: `postgres`

## Configuration Notes

- Frontend production environment variables are configured in [frontend/.env.production](/Users/hampusbosson/Documents/projekt/webb-2/gesällprov/3D-collab-app/frontend/.env.production)
- The backend uses the Docker Compose service name `db` for PostgreSQL connectivity
- The frontend expects explicit API and SignalR environment variables outside local development
- Nginx is configured to support client-side routing for deep links such as `/scene/:sceneId`

## Stop the App

```bash
docker compose down
```

To also remove the PostgreSQL data volume:

```bash
docker compose down -v
```

## Smoke Test

After startup, verify the following:

1. Open [http://localhost:3000](http://localhost:3000)
2. Create a new scene from the dashboard
3. Add several objects and change their transform and material values
4. Refresh the scene and confirm changes persist
5. Open the same scene in a second browser window
6. Confirm live presence, live selection indicators, and realtime object updates work
7. Test undo and redo in the editor

## Why This Project Is Portfolio-Relevant

Collab3D is not just a CRUD app with a polished UI. It combines:

- realtime multi-user collaboration
- interactive 3D scene editing
- full-stack state synchronization
- persistent storage
- deployable infrastructure

That makes it a strong showcase project for frontend, full-stack, and product-oriented engineering roles.
