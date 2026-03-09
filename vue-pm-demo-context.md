# Vue PM Demo — Full context for this project

**Use this file in the new project folder** (e.g. copy to `vue-pm-demo/CONTEXT.md` or `docs/PORTFOLIO-DEMO.md`) so goals, cleanup, and README/deploy specs are in one place.

---

## 1. Purpose and goals

- This app is being turned into a **portfolio demo** for Upwork: a single, deployable “super demo” that showcases multiple stacks.
- **Do not** present it as “from a course” — position it as a portfolio piece that demonstrates ability to ship a Vue + Supabase + Tailwind SPA with auth, CRUD, and clear structure.
- Goals:
  - Fix broken UX and remove learning artifacts so it looks intentional.
  - Add a README that clearly lists all technologies (for clients and proposal matching).
  - Deploy on Vercel with a public URL.
  - Register in the Upwork portfolio and use the live URL in proposals when jobs match Vue, dashboards, SPAs, Supabase, or project management.

---

## 2. What this app is

- **Type:** SPA for project and task management (auth, projects, tasks, collaborators, user profiles).
- **Stack (showcase these in the README):**
  - **Frontend:** Vue 3.5, TypeScript, Vite 7, Vue Router (file-based from `src/pages`), Pinia, Tailwind CSS 4, TanStack Vue Table, reka-ui, VueUse, Lucide icons.
  - **Backend:** Supabase (Auth + PostgreSQL).
  - **Tooling:** ESLint, Prettier, vue-tsc, unplugin-auto-import, unplugin-vue-components, unplugin-vue-router.
- **Features:** Login/register, projects list and detail (in-place edit), tasks list and detail, user profiles, sidebar layout, error boundary, responsive UI.

---

## 3. Cleanup to do (in order)

Complete these in the project folder so the app works as a polished demo.

### 3.1 Profile and Settings routes

- **Problem:** Sidebar has links to `/profile` and `/settings` but no matching page components → 404.
- **Do one of:**
  - **Option A:** Add minimal pages so links work:
    - `src/pages/profile.vue` — e.g. redirect to current user’s profile or a simple “Profile” placeholder.
    - `src/pages/settings.vue` — e.g. simple “Settings” placeholder (heading + one line).
  - **Option B:** Remove the Profile and Settings links from the sidebar so they don’t 404.
- **Recommendation:** Option A so the app feels complete.

### 3.2 Project detail — collaborator link

- **Problem:** Collaborator link uses a broken `to` (e.g. string literal or wrong `name`/`params`).
- **Fix:** Use a proper `:to` binding to `/users/{{ username }}` (or the correct route and param for user profile). Ensure the link navigates to the user profile page.

### 3.3 Task detail page

- **Problem:** Duplicate “Project” column; Comments and collaborator links are placeholders or broken.
- **Fix:**
  - Remove the duplicate “Project” column.
  - Leave Comments as “Coming soon” or a single static message (no backend required).
  - Fix or remove empty/broken collaborator links (same pattern as project detail).

### 3.4 Home page

- **Problem:** Only a generic “Home Page” heading; feels empty.
- **Fix:** Replace with a short dashboard-style line or two, e.g. “Welcome. Use the sidebar to open Projects or My Tasks.” No need for real widgets.

### 3.5 Project detail — Documents section

- **Problem:** “This project doesn’t have documents yet” and/or commented-out table.
- **Fix:** Keep as-is or add one line “Coming soon.” No implementation required.

### 3.6 Global

- **index.html:** Set `<title>` to the project name (e.g. `Vue PM Demo` or `Taskflow`). Currently “Vite App.”
- **Debug:** Remove any `console.log` (e.g. `console.log('TEST :: ', groupedCollabs)` in projects list).

### 3.7 Optional

- Add a small “Demo” or “Portfolio” badge (e.g. in TopNavbar or footer) that links to the GitHub repo or your Upwork/profile link.

---

## 4. README requirements

Replace the default Vite README with a **portfolio-style README** that includes the following.

### 4.1 Title and one-liner

- Example: “Vue PM Demo — Project & task management SPA built with Vue 3, Supabase, and Tailwind.”

### 4.2 Short description

- 2–3 sentences: what the app does (auth, projects, tasks, collaborators, in-place edit, responsive layout).

### 4.3 Tech stack (clear list or table)

- **Frontend:** Vue 3, TypeScript, Vite 7, Vue Router (file-based), Pinia, Tailwind CSS 4, TanStack Vue Table, reka-ui, VueUse, Lucide.
- **Backend:** Supabase (Auth + PostgreSQL).
- **Tooling:** ESLint, Prettier, vue-tsc.

### 4.4 Features

- Bullet list: e.g. Auth (login/register), Projects list and detail with in-place edit, Tasks list and detail, User profiles, Responsive layout, Error handling.

### 4.5 Local setup

- `npm install`
- `npm run dev`
- **Environment variables:** Document that the app needs:
  - `VITE_SUPABASE_URL` — Supabase project URL
  - `VITE_SUPABASE_KEY` — Supabase anon (public) key  
  Note that `database/seed.js` uses `SERVICE_ROLE_KEY` and `TESTING_USER_EMAIL` only for local seeding; do not use service role in the frontend or commit it.

### 4.6 Build and preview

- `npm run build`
- `npm run preview`

### 4.7 Deploy on Vercel

- Short section: “Deploy on Vercel” with a link to Vercel’s Vite docs.
- Instruct to set in the Vercel project: `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`.

### 4.8 License

- e.g. MIT or “Portfolio demo — use for reference.”

---

## 5. Deployment (Vercel)

- **Framework:** Vite (auto-detected).
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment variables (required):**
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_KEY` (anon key only; never use service role in the frontend.)
- Use the existing Supabase project for the demo so the live site has data, or create a dedicated demo project and point these env vars to it. Ensure RLS allows the access the app needs (read/write as appropriate for demo).

---

## 6. Git and repo

- **Repo:** New Git repository (no history from the original masterclass).
- **.gitignore:** Must include `node_modules`, `.env`, `dist`. Do not commit `.env` or any file containing `SERVICE_ROLE_KEY` or other secrets.
- **Naming:** Project name can be “Vue PM Demo” or a product name like “Taskflow”; use the same name in `index.html` title and README.

---

## 7. Upwork leverage (after deploy)

- **Portfolio table:** Update the “Vue PM Demo” row with Live URL (Vercel), Repo URL (GitHub), full stack list, and “Use in proposals for”: Vue, dashboard, SPA, Supabase, project management, Tailwind, TypeScript, auth.
- **Proposals:** When a job matches Vue, dashboards, SPAs, Supabase, or project management, add one line: “You can see a similar Vue 3 + Supabase project management app here: [live URL].”

---

## 8. Quick reference — what “done” looks like

- [ ] Profile and Settings either have minimal pages or sidebar links removed.
- [ ] Project detail collaborator link fixed.
- [ ] Task detail: duplicate column removed; comments/collaborators handled or clearly placeholder.
- [ ] Home has a short welcome/dashboard line.
- [ ] Documents section left as “no documents” or “Coming soon.”
- [ ] `index.html` title set to project name.
- [ ] All debug `console.log` removed.
- [ ] New README with stack, features, setup, and Vercel section.
- [ ] Repo on GitHub; deployed on Vercel with env vars set.
- [ ] Portfolio and proposal line updated in Upwork materials.

---

*Copy this file into your new project folder (e.g. `CONTEXT.md` or `docs/PORTFOLIO-DEMO.md`) so everyone working on the demo has full context.*
