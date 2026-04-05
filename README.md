# meetings-app

MERN-style **meeting transcripts → async AI summary** app: React UI, Express API, BullMQ worker, MongoDB, Redis.

**Architecture (diagram + why Docker Compose & nginx):** see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS) — local dev
- [Docker](https://www.docker.com/) — databases and/or full stack

---

## Option A — Full stack in Docker (like meeting-intelligence-mern)

From the **repo root**:

```bash
cp .env.example .env
```

Edit **`.env`**: set **`JWT_SECRET`**. For real summaries, set **`MOCK_LLM=false`** and put your **`OPENAI_API_KEY`** in the same file (see **`.env.example`**). Optional **`OPENAI_MODEL`** defaults to **`gpt-4o-mini`**. Use **`MOCK_LLM=true`** to skip OpenAI and use placeholder text.

Then:

```bash
cd infra
docker compose up --build
```

Open **http://localhost:8080** (nginx serves the SPA; **`/api`** goes to the API).

Stop:

```bash
docker compose down
```

Run in the background (no log stream in the terminal):

```bash
docker compose up -d --build
```

### Docker cheat sheet (`infra` directory)

Check everything is up:

```bash
cd infra
docker compose ps
```

You want all services **running** (or **healthy** for mongo/redis). If something says **Exited**, check logs for that service name.

Same idea from anywhere:

```bash
docker ps
```

Look for containers whose names include `infra` (or your project folder name): `nginx`, `api`, `worker`, `web`, `mongo`, `redis`.

Quick health check from the host:

```bash
curl -s http://localhost:8080/api/health
```

Should return JSON with `"ok":true`. If that fails, nginx or the API stack isn’t wired right.

Rebuild after code changes:

```bash
docker compose up --build
```

Nuke containers and the Mongo volume (fresh database):

```bash
docker compose down -v
```

### Logs

From `infra`, tail everything:

```bash
docker compose logs -f
```

One service (pick what you care about):

```bash
docker compose logs -f nginx
docker compose logs -f api
docker compose logs -f worker
```

Last 80 lines only, no follow:

```bash
docker compose logs --tail=80 api
```

The API logs **method + path** for each request (e.g. `GET /api/meetings`), plus startup (`API listening on …`). The **worker** prints job completed/failed lines. **nginx** may show access-style lines per request depending on the image; Docker Desktop’s log view is the same stream as `docker compose logs`.

Docker Desktop: open **Containers**, click a container, **Logs** tab—same output as `docker compose logs`.

---

## Option B — Node on your machine, only Mongo + Redis in Docker

```bash
cd infra
docker compose up -d mongo redis
```

In **`apps/api/.env`** and **`apps/worker/.env`** (create if needed):

```env
JWT_SECRET=your-long-random-secret
MONGODB_URI=mongodb://127.0.0.1:27017/meeting_intel
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

(Optional) Set **`ADMIN_EMAIL`** in `apps/api/.env`. Whoever **registers** with that email becomes **admin**.

(Optional) Worker: copy **`OPENAI_API_KEY`** into **`apps/worker/.env`** if you run the worker outside Docker and want real summaries; set **`MOCK_LLM=true`** for mock text only.

Three terminals:

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
- **Web:** Vite (usually http://localhost:5173) with `/api` proxied to the API

---

## Configuration notes

- **`MONGODB_URI`** / **`REDIS_HOST`** / **`REDIS_PORT`** are read from the environment (see `apps/api/src/db.js` and `redis.js`).
- **`ADMIN_EMAIL`**: registration-only admin promotion; existing users are unchanged unless you edit MongoDB.
- **Worker / LLM:** `apps/worker/src/llm.js` — **`MOCK_LLM=true`** uses mock text. If **`MOCK_LLM=false`**, **`OPENAI_API_KEY`** must be set (OpenAI Chat Completions; **`OPENAI_MODEL`** optional).
