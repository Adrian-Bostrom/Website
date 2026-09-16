# Website

Self-hosted development log with a static frontend, Node.js backend, and SQLite database.

The repository is organized into `frontend/src` (browser source), `frontend/dist` (generated Nginx output), `backend` (API and database), `scripts` (build tooling), and `data` (local SQLite files). Every project uses the shared `frontend/src/project.html` template and is selected by its database slug.

## Requirements

- Node.js 22.5 or newer
- npm

## Run locally or on Linux

```bash
npm install
npm run build
npm start
```

`npm run build` publishes the static frontend from `frontend/src` to `frontend/dist`. Serve that directory through Nginx on port 8080. The Node backend listens on port 3000 and serves only the API.

After `npm start`, opening `http://localhost:3000` shows backend status information. Open `http://localhost:8080` for the website after Nginx is running. `http://localhost:3000` is not the frontend.

The frontend calls `/api/...` on its own origin. With the supplied Nginx configuration, `/api/projects` is forwarded to the backend as `/projects` because the trailing slash on `proxy_pass` strips the prefix. The backend supports both forms.

The public site is available at `http://localhost:8080` after Nginx is configured. Port 3000 should remain private and does not serve frontend files.

On the first start, SQLite creates `data/website.sqlite` and seeds the projects and existing development logs. The database files are ignored by Git so each deployment can keep its own content.

For development with automatic server restarts:

```bash
npm run dev
```

Configuration is available through environment variables:

```bash
PORT=3000 DATABASE_PATH=/var/lib/adrian-dev-log/website.sqlite npm start
```

Example Nginx site configuration:

```nginx
server {
	listen 8080;
	root /path/to/frontend/dist;

	location /api/ {
		proxy_pass http://localhost:3000/;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
	}

	location / {
		try_files $uri /index.html;
	}
}
```

## API

- `GET /` shows backend status and the frontend URL.
- `GET /api/health` checks that the server is running.
- `GET /api/projects` returns the project cards.
- `GET /api/projects/:slug` returns a project, its content, and its logs.

The frontend and backend are intentionally separate so Cloudflare Tunnel only needs to expose the Nginx port 8080.

## External connectivity check

From a device outside the tablet, open these URLs using the same public hostname:

```text
https://your-public-hostname.example/api/health
https://your-public-hostname.example/api/projects
```

The first should return `{"status":"ok"}` and the second should return the project list. If `/api/health` fails, the issue is the Cloudflare Tunnel or Nginx proxy, not the frontend. The tunnel should target Nginx on `http://localhost:8080`, never the Node API on port 3000.
