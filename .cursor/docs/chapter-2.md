# Chapter 2: Project Structure and Routing

## Lesson 2.9 - Clean Up Boilerplate

> **Purpose:** Remove default Vue.js boilerplate code and prepare a clean project structure.

### Overview

Clear out default assets, components, routes, stores, and views to start with a minimal setup.

---

### Step 1: Clean Up Source Files

**File:** `src/`

#### Tasks

- [ ] Clear assets folder
- [ ] Clear components folder
- [ ] Clear pre defined routes in index.js
- [ ] Clear import pages in index.js
- [ ] Delete default store
- [ ] Delete default views

---

### Step 2: Clean Up App Files

**File:** `app.vue`

#### Tasks

- [ ] Clear up script
- [ ] Clear up template
- [ ] Add `<h1>Welcome</h1>`
- [ ] Delete `<style>`

---

### Step 3: Clean Up Main Entry

**File:** `main.ts`

#### Tasks

- [ ] Delete import main.css

---

### Step 4: Verify and Commit

**Location:** Terminal

#### Tasks

- [ ] `npm run dev`
- [ ] Check console for any errors
- [ ] `git add -A`
- [ ] `git checkout -b "chapter-2-lesson-9"`
- [ ] `git commit -m "boilerplate cleanup"`
- [ ] `git push origin chapter-2-lesson-9`

---

## Lesson 2.10 - Setting Up Vue Router and Navigation with Router Link

> **Purpose:** Create initial routes and set up navigation using Vue Router with RouterLink components.

### Overview

Set up basic routing structure with HomeView and ProjectsView, then replace anchor tags with RouterLink for client-side navigation.

---

### Step 1: Create View Components

**File:** `src/views/HomeView.vue`

#### Tasks

- [ ] Create HomeView.vue and add:

```vue
<script setup lang="ts">
</script>
<template>
  <div>
    <h1>Home Page</h1>
    <a href="/projects">Go to projects</a> after h1
  </div>
</template>
```

---

**File:** `src/views/ProjectsView.vue`

#### Tasks

- [ ] Create projects.vue:

```vue
<script setup lang="ts"></script>
<template>
  <div>
    <h1>Posts Page</h1>
    <a href="/">Go to home</a>
  </div>
</template>
```

---

### Step 2: Configure Routes

**File:** `router/index.ts`

#### Tasks

- [ ] Create first routes:

```typescript
routes: [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/posts',
    name: 'posts',
    component: PostsView,
  },
],
```

---

### Step 3: Add RouterView

**File:** `app.vue`

#### Tasks

- [ ] Add RouterView:

```vue
<template>
  <main>
    <RouterView />
  </main>
</template>
```

---

### Step 4: Replace Anchor Tags with RouterLink

**File:** `HomeView.vue`

#### Tasks

- [ ] Change `<a>` to `<RouterLink>` for faster page loads:

```vue
<RouterLink to="/posts">Go to posts</RouterLink>
```

---

**File:** `PostsView.vue`

#### Tasks

- [ ] Change `<a>` to `<RouterLink>`:

```vue
<RouterLink to="/posts">Go to posts</RouterLink>
```

---

## Lesson 2.11 - Lazy Loading Routes

> **Purpose:** Implement code splitting by lazy loading route components to improve initial page load performance.

### Overview

Convert route components to use dynamic imports, allowing Vue Router to load components only when needed.

---

### Step 1: Implement Lazy Loading

**File:** `router/index.ts`

#### Tasks

- [ ] Change project route to lazy loading:

```typescript
component: () => import('@/views/ProjectsView.vue')
```

- [ ] Delete import at top of file

---

### Step 2: Verify Lazy Loading

**Location:** Browser DevTools

#### Tasks

- [ ] Inspect > Network to see if only project file is loaded

---

## Lesson 2.12 - Dynamic Routes with Parameters

> **Purpose:** Create dynamic routes that accept URL parameters to display individual project details.

### Overview

Add a route with a dynamic `:id` parameter and access route parameters in the component using `useRoute()`.

---

### Step 1: Create Single Project View

**File:** `src/views/SingleProjectView.vue`

#### Tasks

- [ ] Create SingleProjectView.vue
- [ ] Inside SingleProject view add:

```typescript
import {useRoute} from 'vue-router';
```

- [ ] Add:

```typescript
const route = useRoute();
```

- [ ] Change heading to use:

```vue
<h1>Projects {{ route.params.id }}</h1>
```

- [ ] Now add `?` after params so that undefined is called when there is no param and not error:

```vue
<h1>Projects {{ route.params?.id }}</h1>
```

---

### Step 2: Add Dynamic Route

**File:** `router/index.ts`

#### Tasks

- [ ] Add new route with wildcard `:id`:

```typescript
{
  path: '/posts/:id',
  name: 'single-post',
  component: () => import('@/views/SinglePostView.vue'),
},
```

---

## Lesson 2.13 - 404 Not Found Route

> **Purpose:** Add a catch-all route to handle undefined pages and display a 404 error.

### Overview

Create a fallback route that matches any unmatched paths and displays a 404 message.

---

### Step 1: Add Catch-All Route

**File:** `router/index.ts`

#### Tasks

- [ ] Add path for undefined pages:

```typescript
{
  path: '/:catchAll(.*)*',
  name: 'not-found',
  component: h('p',{style: 'color: red;'}, '404 - Not Found')
}
```

---

## Lesson 2.14 - File-Based Routing with unplugin-vue-router

> **Purpose:** Set up automatic file-based routing using unplugin-vue-router for type-safe, convention-based routing.

### Overview

Install and configure unplugin-vue-router to automatically generate routes from the file system structure, eliminating manual route configuration.

---

### Step 1: Install unplugin-vue-router

**Location:** Terminal

#### Tasks

- [ ] `npm install -D unplugin-vue-router` - to help routing

---

### Step 2: Configure Vite Plugin

**File:** `vite.config.ts`

#### Tasks

- [ ] Add:

```typescript
import VueRouter from 'unplugin-vue-router/vite'
```

- [ ] Add `VueRouter()`, before `vue()`

---

### Step 3: Update Router Configuration

**File:** `router/index.ts`

#### Tasks

- [ ] Change from 'vue-router' to 'vue-router/auto':

```typescript
import { createRouter, createWebHistory } from 'vue-router/auto'
```

- [ ] Now delete all paths and imports to only have:

```typescript
import { createRouter, createWebHistory } from 'vue-router/auto'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL)
})

export default router
```

- [ ] Add:

```typescript
import {routes} from 'vue-router/auto-routes'
```

- [ ] Now add routes to:

```typescript
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
```

---

### Step 4: Rename Views to Pages

**Location:** src

#### Tasks

- [ ] Rename views to pages

---

### Step 5: Configure TypeScript

**File:** `tsconfig.app.json`

#### Tasks

- [ ] Add under "include": `"typed-router.d.ts"`
- [ ] Also add `"moduleResolution": "Bundler"`, so that it looks like this:

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue", "typed-router.d.ts"],
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "moduleResolution": "Bundler",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

**File:** `env.d.ts`

#### Tasks

- [ ] Add:

```typescript
/// <reference types="unplugin-vue-router/client" />
```

---

### Step 6: Verify Setup

**Location:** VS Code / Browser

#### Tasks

- [ ] Command + shift + P then reload window to check all is sync
- [ ] Inspect console

---

## Lesson 2.15 - File-Based Route Structure

> **Purpose:** Organize pages using file-based routing conventions with index files and dynamic route parameters.

### Overview

Restructure pages directory to follow file-based routing conventions: index.vue for default routes, [id].vue for dynamic routes, and [...catchAll].vue for 404 pages.

---

### Step 1: Reorganize Page Files

**Location:** pages

#### Tasks

- [ ] Change HomeView.vue to index.vue
- [ ] Under pages create new folder called Projects
- [ ] Move ProjectsView.vue under projects and rename to index.vue
- [ ] Move SingleProjectView.vue to projects folder and rename [id].vue
- [ ] Create [...catchAll].vue and add:

```vue
<script setup lang="ts"></script>

<template>
  <div>
    <h1>404 Not Found</h1>
  </div>
</template>
```

---

### Step 2: Update Route Links

**File:** `pages/projects/index.vue`

#### Tasks

- [ ] Change link to:

```vue
<RouterLink :to="{ name: '/projects/[id]', params: { id: 1 } }">Go To Projects</RouterLink>
```
