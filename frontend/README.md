---

# Local Development

## Requirements

* Node 18 or higher
* npm
* Git

---

# Backend (Cloudflare Worker)

```bash
cd backend
npm install
npm start      # runs wrangler dev
```

Backend will be available at:

```
http://127.0.0.1:8787
```

Leave this terminal running.

---

# Frontend (Vite App)

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at the URL shown, typically:

```
http://localhost:5173
```

---

# Project Structure

```
backend/   Cloudflare Worker API (development via wrangler)
frontend/  Vite-based web client
data/      CSV data used by backend (if applicable)
```

---

# Production Notes

* Frontend is deployed as a static site (GitHub Pages or similar).
* Backend is deployed as a Cloudflare Worker (wrangler publish).
* Data may come from CSV or Supabase depending on environment.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

### Why Cloudflare Workers?
The frontend is a static site and cannot run backend logic on GitHub Pages.  
Cloudflare Workers provide a lightweight API layer for loading data, proxying future Supabase queries, and keeping keys and logic off the client.  
You don’t technically need a Cloudflare Worker just to read a CSV file.  
The Worker exists because GitHub Pages cannot run backend code, so the CSV can’t be processed or served directly from the frontend.  
The Worker provides a tiny API endpoint that the static site can call, acting as the “backend” in an otherwise serverless setup.

