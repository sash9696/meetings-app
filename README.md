# meetings-app

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Docker](https://www.docker.com/) (for MongoDB + Redis)

## 1. Start databases

```bash
cd infra
docker compose up -d
```

Stop when done:

```bash
docker compose down
```

## 2. Configure API

In `apps/api`, add a `.env` file with at least:

```env
JWT_SECRET=your-long-random-secret
```

(Optional) Set `ADMIN_EMAIL` in `apps/api/.env` to an email address. Whoever **registers** with that email becomes **admin** (Users screen: list + remove accounts). Existing users keep their current role unless you update them in MongoDB.

(Optional) For summarization without Ollama, in `apps/worker` use `MOCK_LLM=true` in `.env`.

## 3. Install and run

Open three terminals from the repo root:

```bash
cd apps/api && npm install && npm run dev
```

```bash
cd apps/worker && npm install && npm start
```

```bash
cd apps/web && npm install && npm run dev
```

- **API:** http://localhost:3000  
- **Web:** the URL Vite prints (usually http://localhost:5173)

Register a user in the UI, then create meetings as usual.
