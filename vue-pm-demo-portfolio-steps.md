# Vue PM Demo — Portfolio Project: Steps in Order

Turn the Vue masterclass app into a polished portfolio demo: clone, cleanup, README, deploy on Vercel, then register for Upwork.

---

## Order of operations

Follow these steps in order. Do not skip ahead.

---

### Step 1: Clone the app to a new folder

1. Copy the entire folder `C:\dev\masterclass\vuejs-masterclass-2024` to a new location, e.g.:
   - `C:\dev\vue-pm-demo`  
   - or `C:\dev\portfolio\vue-pm-demo`
2. Do **not** work inside the masterclass folder; the clone is your public demo repo.

---

### Step 2: Prepare the Git repo

1. Open a terminal in the **cloned** folder.
2. Remove any existing `.git` (if you copied it):  
   `rmdir /s /q .git` (Windows) or `rm -rf .git` (Mac/Linux).
3. Initialise a new repo:  
   `git init`
4. Ensure `.gitignore` exists and includes:
   - `node_modules`
   - `.env`
   - `dist`
   - `.DS_Store` (optional)
   - IDE folders (e.g. `.idea`, `.vscode` if you prefer not to commit them)
5. Do **not** commit `.env` or any file containing `SERVICE_ROLE_KEY` or secrets.

---

### Step 3: Minimal code cleanup (in the clone)

Do these edits in the **cloned** project only.

| # | Where | What to do |
|---|--------|------------|
| 3.1 | **Profile & Settings** | Either add minimal pages `src/pages/profile.vue` and `src/pages/settings.vue` (e.g. simple “Profile” / “Settings” placeholder so sidebar links don’t 404), **or** remove the Profile and Settings links from the sidebar. |
| 3.2 | **Project detail** | Fix the collaborator link. Find the link that uses `to="{ name: '/users/[username]', params: ... }"` and replace with a proper `:to` binding to `/users/{{ username }}` (or the correct param). |
| 3.3 | **Task detail** | Remove the duplicate “Project” column. Leave Comments as “Coming soon” or one static line; fix or remove empty collaborator links. |
| 3.4 | **Home page** | Replace the bare “Home Page” with a short line, e.g. “Welcome. Use the sidebar to open Projects or My Tasks.” |
| 3.5 | **Project detail — Documents** | Keep “This project doesn’t have documents yet” or add “Coming soon”. No implementation needed. |
| 3.6 | **index.html** | Set `<title>` to the project name, e.g. `Vue PM Demo` or `Taskflow`. |
| 3.7 | **Projects list** | Remove `console.log('TEST :: ', groupedCollabs)` (or any other debug logs). |
| 3.8 | **Optional** | Add a small “Demo” or “Portfolio” badge (e.g. in TopNavbar or footer) linking to the repo or your profile. |

---

### Step 4: Write the new README (in the clone)

1. Replace the existing `README.md` in the **cloned** repo with a portfolio-style README.
2. Include at least:
   - **Title and one-liner** (e.g. “Vue PM Demo – Project & task management SPA with Vue 3, Supabase, Tailwind”).
   - **Short description** of what the app does (auth, projects, tasks, collaborators, in-place edit).
   - **Tech stack** as a clear table or list, e.g.:
     - Frontend: Vue 3, TypeScript, Vite 7, Vue Router (file-based), Pinia, Tailwind CSS 4, TanStack Vue Table, reka-ui, VueUse, Lucide.
     - Backend: Supabase (Auth + PostgreSQL).
     - Tooling: ESLint, Prettier, vue-tsc.
   - **Features:** bullet list (auth, projects CRUD, tasks, user profiles, responsive layout, error handling).
   - **Local setup:** `npm install`, `npm run dev`; list required env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY` (and note that seed uses `SERVICE_ROLE_KEY` and `TESTING_USER_EMAIL` only for local DB seeding).
   - **Build:** `npm run build`, `npm run preview`.
   - **Deploy on Vercel:** short section with link to Vercel docs; note to set `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` in the Vercel project.
   - **License** (e.g. MIT or “Portfolio demo – use for reference”).

---

### Step 5: Push to GitHub and deploy on Vercel

1. Create a **new** repository on GitHub (e.g. `vue-pm-demo` or `taskflow-demo`).
2. In the **cloned** folder, add remote and push:
   - `git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git`
   - `git add .`
   - `git commit -m "Portfolio demo: Vue PM app with cleanup and README"`
   - `git push -u origin main` (or `master`, depending on your default branch).
3. In [Vercel](https://vercel.com): **Add New Project** → Import the GitHub repo.
4. Framework: leave as **Vite** (auto-detected). Build: `npm run build`. Output: `dist`.
5. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_KEY` = your Supabase **anon** (public) key
6. Deploy. Note the **live URL** (e.g. `vue-pm-demo.vercel.app`).

---

### Step 6: Register in Upwork brain (this repo)

1. Open `context/portfolio.md` in the upwork-brain workspace.
2. Update the **Vue PM Demo** row:
   - **Live URL:** your Vercel URL (e.g. `https://vue-pm-demo.vercel.app`).
   - **Repo URL:** your GitHub repo URL.
   - **Stack:** Vue 3, Pinia, Tailwind, Supabase, TypeScript, Vite, TanStack Table (and any others you want to highlight).
   - **Use in proposals for:** Vue, dashboard, SPA, Supabase, project management, Tailwind, TypeScript, auth.
3. Optionally add a portfolio detail file:
   - Copy `profile-assets/portfolio/_TEMPLATE.md` to `profile-assets/portfolio/vue-pm-demo.md`.
   - Fill in: project name, stack, link, description, technical highlights, key features, relevance tags, “When to use in proposals.”

---

### Step 7: Use in proposals

When a job matches **Vue, dashboards, SPAs, Supabase, or project management**, add one line to your cover letter, e.g.:

> You can see a similar Vue 3 + Supabase project management app here: [your live URL].

Position it as a portfolio piece that shows you can ship a Vue + Supabase + Tailwind SPA with auth, CRUD, and clear structure. No need to mention the course.

---

## Checklist (quick reference)

- [ ] Step 1: Clone masterclass to new folder (e.g. `vue-pm-demo`).
- [ ] Step 2: New git repo; .gitignore; no .env committed.
- [ ] Step 3: Cleanup (profile/settings or remove links, fix project link, task detail, home, title, remove console.log).
- [ ] Step 4: New README with stack table, features, setup, Vercel.
- [ ] Step 5: Push to GitHub; Vercel project; set env vars; deploy; note live URL.
- [ ] Step 6: Update `context/portfolio.md`; optional `profile-assets/portfolio/vue-pm-demo.md`.
- [ ] Step 7: Use live URL in proposals when relevant.

---

## File locations reference

| Item | Path |
|------|------|
| Source (do not edit for demo) | `C:\dev\masterclass\vuejs-masterclass-2024` |
| Clone (your demo repo) | e.g. `C:\dev\vue-pm-demo` or `C:\dev\portfolio\vue-pm-demo` |
| Portfolio table | `context/portfolio.md` |
| Portfolio detail template | `profile-assets/portfolio/_TEMPLATE.md` |
| This steps file | `vue-pm-demo-portfolio-steps.md` (workspace root) |
