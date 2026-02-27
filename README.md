# Skill Roadmap Builder

A full-stack web app to create and manage learning roadmaps. You can create a roadmap (e.g. "Learn React"), add ordered steps to it, reorder them, edit or delete them — all saved in a database.

---

## Tech Stack

| Layer            | Tech                            |
|------------------|---------------------------------|
| Frontend         | React 19 + Vite                 |
| Backend          | Node.js + Express               |
| Database         | MongoDB (Mongoose)              |
| Containerization | Docker + Docker Compose         |


## How It Works

```
Browser → React Frontend (port 5173)
              ↓  HTTP API calls
        Express Backend (port 5001)
              ↓  Mongoose
           MongoDB (port 27017)
```

1. The frontend fetches roadmaps from the backend REST API.
2. The backend handles CRUD for roadmaps and their steps.
3. Data is stored in MongoDB.

---

## API Endpoints

| Method | Endpoint                              | What it does         |
|--------|---------------------------------------|----------------------|
| GET    | `/api/roadmaps`                       | List all roadmaps    |
| POST   | `/api/roadmaps`                       | Create a roadmap     |
| GET    | `/api/roadmaps/:id`                   | Get one roadmap      |
| PUT    | `/api/roadmaps/:id`                   | Update a roadmap     |
| DELETE | `/api/roadmaps/:id`                   | Delete a roadmap     |
| POST   | `/api/roadmaps/:id/steps`             | Add a step           |
| PUT    | `/api/roadmaps/:id/steps/reorder`     | Reorder steps        |
| PUT    | `/api/roadmaps/:roadmapId/steps/:stepId`  | Update a step    |
| DELETE | `/api/roadmaps/:roadmapId/steps/:stepId` | Delete a step    |

---

## Project Structure

```
Skill/
├── backend/
│   ├── controllers/    # Route logic
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   ├── server.js       # Entry point
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── hooks/      # Custom hooks
│   │   ├── api.js      # API call helpers
│   │   └── App.jsx
│   └── Dockerfile
└── docker-compose.yml
```

---

## Run with Docker (Recommended)

> Requires [Docker Desktop](https://www.docker.com/products/docker-desktop) installed.

```bash
# 1. Clone the repo
git clone <https://github.com/Arundhathi27/landing_page.git>
cd Skill

# 2. Build and start all services
docker compose up --build
```

That's it. Open your browser:

- **Frontend** → http://localhost:5173
- **Backend API** → http://localhost:5001/api/roadmaps

```bash
# Stop everything
docker compose down

# Stop and wipe database
docker compose down -v
```

---

## Run Locally (Without Docker)

### Prerequisites
- Node.js 18+
- MongoDB running locally

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/learning-path-builder
```

```bash
npm start
# or for hot reload:
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173
