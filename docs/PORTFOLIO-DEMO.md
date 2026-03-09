# Vue PM Demo — Full context for this project

Goals, cleanup, and README/deploy specs in one place.

---

## 1. Purpose and goals

- This app is a **portfolio demo** for Upwork: a single, deployable demo that showcases Vue + Supabase + Tailwind.
- Position it as a portfolio piece that demonstrates ability to ship a Vue + Supabase + Tailwind SPA with auth, CRUD, and clear structure.
- Goals: polished UX, README with tech stack, deploy on Vercel, register in Upwork portfolio and use live URL in proposals when jobs match Vue, dashboards, SPAs, Supabase, or project management.

---

## 2. What this app is

- **Type:** SPA for project and task management (auth, projects, tasks, collaborators, user profiles).
- **Stack:** Vue 3, TypeScript, Vite 7, Vue Router (file-based), Pinia, Tailwind CSS 4, TanStack Vue Table, reka-ui, VueUse, Lucide. Backend: Supabase (Auth + PostgreSQL). Tooling: ESLint, Prettier, vue-tsc.

---

## 3. Deployment (Vercel)

- Build: `npm run build`. Output: `dist`.
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY` (anon key only).

---

## 4. Upwork leverage

- Update portfolio row with Live URL, Repo URL, stack, and “Use in proposals for”: Vue, dashboard, SPA, Supabase, project management, Tailwind, TypeScript, auth.
- In proposals: “You can see a similar Vue 3 + Supabase project management app here: [live URL].”
