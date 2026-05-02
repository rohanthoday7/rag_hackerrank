# 🚀 SentinelSupport Production Deployment Guide

This guide explains how to deploy SentinelSupport to a **100% Free** production environment using a split architecture: 
- **Frontend** hosted on Vercel (Fast, Global Edge Network)
- **Backend** hosted on Render (Persistent Docker Web Service)

---

## 🏗️ Architecture Overview

For a hackathon, stability and cost are paramount.
1.  **Backend (Render):** We use a Dockerized FastAPI app managed by Gunicorn. Render provides a **Free Web Service** tier that allows us to attach a persistent disk. This ensures our SQLite database (`sentinel_support.db`) and local FAISS indexes are preserved across restarts.
2.  **Frontend (Vercel):** We deploy the React app as a static site. Vercel is highly optimized for React applications, provides a global CDN, and handles client-side routing automatically via `vercel.json`.

---

## Step 1: Deploy Backend to Render

1. Create an account on [Render.com](https://render.com/).
2. Push this repository to GitHub.
3. In the Render Dashboard, click **New +** and select **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically detect the `render.yaml` file at the root of the repository and configure the service.
6. When prompted, fill in the environment variables:
   - `SENTINEL_GEMINI_API_KEY`: Your real Google Gemini API Key.
   - `SENTINEL_API_KEY`: Generate a secure random password (e.g., `my-super-secret-key-123`). Save this for later.
7. Click **Apply**.
8. Wait for the deployment to finish. Once live, Render will provide a URL like `https://sentinel-backend-xxxx.onrender.com`.
9. **Verify:** Visit `https://sentinel-backend-xxxx.onrender.com/api/v1/healthz` in your browser. It should return `{"status":"ok"}`.

---

## Step 2: Deploy Frontend to Vercel

1. Create an account on [Vercel.com](https://vercel.com/).
2. Click **Add New Project** and import your GitHub repository.
3. Vercel will automatically detect that it's a **Vite** project.
4. Open the **Environment Variables** section and add:
   - `VITE_BACKEND_URL`: The URL of your Render backend **without a trailing slash** (e.g., `https://sentinel-backend-xxxx.onrender.com`).
   - `VITE_BACKEND_API_KEY`: The exact same secret key you generated for `SENTINEL_API_KEY` on Render.
5. Click **Deploy**.
6. Vercel will build the frontend and provide you with a live URL. The routing is handled flawlessly thanks to `vercel.json`.

---

## 🧪 Local Production Testing (Docker Compose)

You can test the exact production setup locally before pushing. This simulates the production Nginx proxy and Gunicorn backend.

1. Ensure Docker is running.
2. Copy `.env.example` to `.env` and fill in your keys.
3. Build and start the stack:
   ```bash
   docker-compose build
   docker-compose up -d
   ```
4. Access the app at `http://localhost:3000`. The frontend will be served by Nginx, and API requests to `/api` will be seamlessly proxied to the Gunicorn backend running on port 8001.
5. To view logs:
   ```bash
   docker-compose logs -f
   ```
6. To shut down:
   ```bash
   docker-compose down
   ```

*(Note: If you want to use the hot-reloading development setup, use `docker-compose -f docker-compose.dev.yml up` instead).*

---

## 🛡️ Security Hardening Checks

- **Persistent Disk:** Render explicitly mounts `/app/data` to prevent data loss on restarts.
- **API Key Required:** FastAPI enforces the `X-API-Key` header on all protected routes.
- **Non-Root Docker:** The backend runs as a low-privileged `appuser`.
- **Worker Concurrency:** Gunicorn is configured via `gunicorn_conf.py` to prevent memory blowouts on the free 512MB tier.
- **Client-Side Routing:** `vercel.json` rewrites all undefined paths to `index.html` to prevent 404s on page refresh.
