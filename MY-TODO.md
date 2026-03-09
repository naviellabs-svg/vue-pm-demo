# My to-do list — after code is done

Do these steps yourself. Code cleanup and README are already done.

---

## 1. Check Git and secrets

- [x] `.gitignore` has `node_modules`, `.env`, `dist` (already there).
- [x] Do **not** commit `.env` or any file with `SERVICE_ROLE_KEY`.

---

## 2. Push to GitHub

- [x] Create a **new** repo on GitHub (e.g. `vue-pm-demo` or `taskflow-demo`).
- [ ] In this folder, run:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
  git add .
  git commit -m "Portfolio demo: Vue PM app with cleanup and README"
  git push -u origin main
  ```
  (Use `master` if that’s your default branch.)

---

## 3. Deploy on Vercel

- [ ] In [Vercel](https://vercel.com): **Add New Project** → Import your GitHub repo.
- [ ] Framework: **Vite**. Build: `npm run build`. Output: `dist`.
- [ ] Add **Environment Variables**:
  - `VITE_SUPABASE_URL` = your Supabase project URL
  - `VITE_SUPABASE_KEY` = your Supabase **anon** key
- [ ] Deploy and note your **live URL** (e.g. `vue-pm-demo.vercel.app`).

---

## 4. Register in Upwork brain

- [ ] In your upwork-brain workspace, open `context/portfolio.md`.
- [ ] Update the **Vue PM Demo** row:
  - **Live URL:** your Vercel URL
  - **Repo URL:** your GitHub repo URL
  - **Stack:** Vue 3, Pinia, Tailwind, Supabase, TypeScript, Vite, TanStack Table (and any others you want).
  - **Use in proposals for:** Vue, dashboard, SPA, Supabase, project management, Tailwind, TypeScript, auth.
- [ ] Optional: copy `profile-assets/portfolio/_TEMPLATE.md` to `profile-assets/portfolio/vue-pm-demo.md` and fill it in.

---

## 5. Use in proposals

- [ ] When a job matches **Vue, dashboards, SPAs, Supabase, or project management**, add one line to your cover letter, e.g.:
  > You can see a similar Vue 3 + Supabase project management app here: [your live URL].

---

## Quick checklist

- [ ] New GitHub repo created and code pushed
- [ ] Vercel project created, env vars set, deployed
- [ ] Live URL noted
- [ ] Upwork portfolio table updated
- [ ] Optional portfolio detail file added
- [ ] Use live URL in proposals when relevant
