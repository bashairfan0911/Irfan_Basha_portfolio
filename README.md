# Irfan Basha — Portfolio

> A full-stack DevOps portfolio with a **public blog**, **admin CMS**, and **project showcase**.  
> Built with **React + Vite + TypeScript**, **MongoDB Atlas**, and **Tailwind CSS**.  
> Deployed on **Vercel** (serverless) or **Docker** (self-hosted).

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui |
| Backend API | Node.js (Vercel Serverless / Express for Docker) |
| Database | MongoDB Atlas |
| Deployment | Vercel (prod) · Docker + Compose (self-hosted) |

---

## 📦 Project Structure

```
├── api/                    # Vercel serverless API functions
│   ├── posts.mjs           #   GET  /api/posts.mjs  (public)
│   └── admin/
│       └── posts.mjs       #   POST/PUT/DELETE /api/admin/posts.mjs (auth)
├── src/
│   ├── components/
│   │   ├── BlockEditor.tsx  # Inline text+image block editor
│   │   └── BlogAuthGate.tsx # Admin password gate
│   ├── context/
│   │   └── BlogContext.tsx  # Global blog state via API
│   └── pages/
│       ├── Blog.tsx         # Public blog listing
│       ├── BlogPost.tsx     # Public post viewer (inline blocks)
│       └── Admin.tsx        # Password-protected CMS
├── server.mjs              # Production Express server (Docker)
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # App + MongoDB Compose stack
└── vercel.json             # Vercel routing config
```

---

## ⚡ Local Development

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (or local MongoDB via Docker)

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and fill in your MongoDB connection string
```

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/
MONGODB_DATABASE=portfolio
MONGODB_COLLECTION=blogPosts
ADMIN_PASSWORD=Irfan@2024
```

### 3. Run dev server
```bash
npm run dev
# → http://localhost:8080
```

The Vite dev server includes a middleware that proxies `/api/*` to MongoDB, exactly mirroring the Vercel serverless functions.

---

## 🐳 Docker Deployment

### Quick Start (with local MongoDB)
```bash
# Build and start app + MongoDB
docker compose up --build

# → http://localhost:3000
```

### With MongoDB Atlas
Edit `docker-compose.yml` — comment out the `mongo` service and set your Atlas URI:
```yaml
MONGODB_URI: mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/
```

Then:
```bash
docker compose up --build app   # start only the app service
```

### Build image only
```bash
docker build -t irfan-portfolio:latest .
```

### Run container manually
```bash
docker run -d \
  -p 3000:3000 \
  -e MONGODB_URI="mongodb+srv://..." \
  -e MONGODB_DATABASE="portfolio" \
  -e MONGODB_COLLECTION="blogPosts" \
  -e ADMIN_PASSWORD="Irfan@2024" \
  --name portfolio \
  irfan-portfolio:latest
```

---

## 🌐 Vercel Deployment

1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add environment variables in **Settings → Environment Variables**:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/` |
| `MONGODB_DATABASE` | `portfolio` |
| `MONGODB_COLLECTION` | `blogPosts` |
| `ADMIN_PASSWORD` | your secret password |

4. Deploy → done ✅

> **Important:** In MongoDB Atlas → Network Access → allow `0.0.0.0/0` so Vercel's dynamic IPs can connect.

---

## 📝 Blog CMS

| Route | Access |
|-------|--------|
| `/blog` | Public — anyone can read |
| `/blog/:id` | Public — full post view |
| `/admin` | Password protected — only you |

### Admin features
- **Block editor** — mix text (HTML) and images in any order
- **Local image upload** — base64 stored in MongoDB (no CDN needed)
- **Auto aspect ratio** — images detected and displayed at natural size
- **Create / Edit / Delete** posts

### Change admin password
```ts
// src/components/BlogAuthGate.tsx  line 8
const ADMIN_PASSWORD = "YourNewPassword";
```
Must match the `ADMIN_PASSWORD` environment variable.

---

## 🐳 Docker Image Details

### Multi-stage build breakdown

| Stage | Base image | Purpose |
|-------|-----------|---------|
| `deps` | `node:20-alpine` | Install prod dependencies (cached layer) |
| `builder` | `node:20-alpine` | Install all deps + `npm run build` |
| `runner` | `node:20-alpine` | Final image: dist + prod node_modules + server |

### Why it's small
- ✅ Only production `node_modules` in final image (no devDeps)
- ✅ Source code excluded — only compiled `dist/` copied
- ✅ Alpine base (~5MB vs ~900MB for full Debian)
- ✅ `.dockerignore` excludes `node_modules`, `.git`, logs, tests
- ✅ `npm cache clean` after each install
- ✅ Non-root user (`appuser`) for security

---

## 🔒 Security

- Admin routes protected by `Bearer` token (password)
- Non-root Docker user
- `.env` excluded from Docker image (injected at runtime)
- MongoDB credentials never in source code

---

## 📄 License

MIT © Irfan Basha
