# Setup and Run Instructions

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Docker** and **Docker Compose**

## Quick Start

```bash
# 1. Clone and navigate to project
git clone https://github.com/omarhmoursy/vial-tha
cd take-home-assignment-A-main

# 2. Start database
docker compose up -d vial-backend

# 3. Setup backend (in new terminal)
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev

# 4. Setup frontend (in another terminal)
cd frontend
npm install
npm run dev
```

## Access the Application

**Use this URL:** **http://localhost:3000** - This is your main application interface

Other URLs (for reference):
- **Backend API**: http://127.0.0.1:8080 (raw data, used by developers)
- **API Documentation**: See `API_DOCUMENTATION.md`

## Troubleshooting

### Docker Command Issues
If `docker compose` doesn't work, try `docker-compose` for older Docker versions.

### Port Conflicts
The database uses port 5433 (not the default 5432) to avoid conflicts. If you still have port issues:
```bash
# Check what's using ports
lsof -i :5433  # Database
lsof -i :8080  # Backend
lsof -i :3000  # Frontend
```

### Docker Credential Issues
If Docker fails to start, edit `~/.docker/config.json` and remove the `"credsStore"` line if present.

### Database Issues
```bash
# Restart database
docker compose restart vial-backend

# Reset database if needed
cd backend
npx prisma migrate reset
npx prisma db seed
```

That's it! Open **http://localhost:3000** in your browser to use the application. 