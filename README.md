# Vue PM Demo

**Live demo:** [vue-pm-demo.vercel.app](https://vue-pm-demo.vercel.app) *(replace with your Vercel URL after deploy)*

**Project & task management SPA** built with Vue 3, Supabase, and Tailwind.

A full-stack demo app for managing projects and tasks: sign up or log in, create and edit projects (with in-place editing), manage tasks, and view user profiles. Suited as a portfolio piece for Vue, Supabase, and modern front-end work.

---

## Demo credentials

For the live demo or local tryout, use a pre-defined account:

- **Option A (seed):** Run `npm run db:seed` once to create the demo user. Then use the **email** from your `.env` value `TESTING_USER_EMAIL` and **password** `password`.
- **Option B (Fill demo button):** Set in `.env` (or in Vercel env vars for production):
  - `VITE_DEMO_EMAIL` — demo user email
  - `VITE_DEMO_PASSWORD` — demo user password  
  Then on the login page click **Fill demo** to pre-fill the form and log in with one click.

---

## What it does

- **Auth:** Register and log in with Supabase Auth.
- **Projects:** List projects, open a project, and edit name, description, and status in place.
- **Tasks:** List your tasks, open task details, see project and collaborators.
- **Profiles:** View user profiles from project/task collaborator links.
- **Layout:** Sidebar navigation, responsive layout, and basic error handling.

---

## Tech stack

| Layer   | Technologies |
|--------|----------------|
| Frontend | Vue 3, TypeScript, Vite 7, Vue Router (file-based), Pinia, Tailwind CSS 4, TanStack Vue Table, reka-ui, VueUse, Lucide icons |
| Backend  | Supabase (Auth + PostgreSQL) |
| Tooling  | ESLint, Prettier, vue-tsc, unplugin-auto-import, unplugin-vue-components, unplugin-vue-router |

---

## Features

- Auth (login / register)
- Projects list and detail with in-place edit
- Tasks list and detail
- User profiles
- Responsive layout
- Error handling

---

## Local setup

1. **Install dependencies**

   ```sh
   npm install
   ```

2. **Environment variables**

   Create a `.env` in the project root with:

   - `VITE_SUPABASE_URL` — your Supabase project URL  
   - `VITE_SUPABASE_KEY` — your Supabase **anon** (public) key  
   - Optional: `VITE_DEMO_EMAIL` and `VITE_DEMO_PASSWORD` for the login page **Fill demo** button.

   The app uses these for the frontend. The script `database/seed.js` uses `SERVICE_ROLE_KEY` and `TESTING_USER_EMAIL` only for local database seeding; do not use the service role key in the frontend or commit it.

3. **Run the app**

   ```sh
   npm run dev
   ```

---

## Build and preview

```sh
npm run build
npm run preview
```

---

## Deploy on Vercel

1. Push the repo to GitHub and [import it in Vercel](https://vercel.com/docs/frameworks/vite).
2. Use **Vite** as the framework (usually auto-detected). Build: `npm run build`, output: `dist`.
3. In the Vercel project **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase project URL  
   - `VITE_SUPABASE_KEY` = your Supabase **anon** key  
4. Deploy. Your live URL will be something like `vue-pm-demo.vercel.app`.

---

## License

Portfolio demo — use for reference. MIT or similar is fine; do not present as from a course.
