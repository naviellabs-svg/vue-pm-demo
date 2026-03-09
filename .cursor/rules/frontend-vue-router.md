# Frontend: Vue Router Patterns

## Overview

Patterns and best practices for Vue Router setup, file-based routing with unplugin-vue-router, lazy loading, dynamic routes, and navigation patterns.

## When to Use

- ✅ Setting up routing in Vue.js applications
- ✅ Implementing file-based routing
- ✅ Creating dynamic routes with parameters
- ✅ Implementing lazy loading for code splitting
- ✅ Handling 404 pages and catch-all routes

## File-Based Routing Setup

### Installation

```bash
npm install -D unplugin-vue-router
```

### Vite Configuration

**File:** `vite.config.ts`

```typescript
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    VueRouter(), // Must be before vue()
    vue()
  ]
})
```

### Router Configuration

**File:** `router/index.ts`

```typescript
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
```

### TypeScript Configuration

**File:** `tsconfig.app.json`

```json
{
  "include": [
    "env.d.ts",
    "src/**/*",
    "src/**/*.vue",
    "typed-router.d.ts"
  ],
  "compilerOptions": {
    "moduleResolution": "Bundler"
  }
}
```

**File:** `env.d.ts`

```typescript
/// <reference types="unplugin-vue-router/client" />
```

## File-Based Route Structure

### Convention

Routes are automatically generated from the `src/pages/` directory:

```
src/pages/
├── index.vue              → / (home route)
├── about.vue              → /about
├── projects/
│   ├── index.vue          → /projects
│   └── [slug].vue         → /projects/:slug (dynamic)
└── [...catchAll].vue      → /* (404 catch-all)
```

### Route Patterns

- **`index.vue`** → Default route for directory
- **`[param].vue`** → Dynamic route parameter
- **`[...catchAll].vue`** → Catch-all route (404)

## Basic Routing

### Manual Route Configuration

**File:** `router/index.ts`

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProjectsView from '@/views/ProjectsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView
    }
  ]
})

export default router
```

### RouterView Component

**File:** `App.vue`

```vue
<template>
  <main>
    <RouterView />
  </main>
</template>
```

## Navigation Patterns

### RouterLink Component

Replace anchor tags with `RouterLink` for client-side navigation:

```vue
<template>
  <!-- Instead of <a href="/projects"> -->
  <RouterLink to="/projects">Go to Projects</RouterLink>
  
  <!-- Named routes -->
  <RouterLink :to="{ name: '/projects/[id]', params: { id: 1 } }">
    Project 1
  </RouterLink>
</template>
```

### Programmatic Navigation

```typescript
import { useRouter } from 'vue-router'

const router = useRouter()

// Navigate to route
router.push('/projects')
router.push({ name: 'projects' })
router.push({ name: '/projects/[id]', params: { id: 1 } })

// Replace current route
router.replace('/projects')

// Go back
router.back()
```

## Dynamic Routes

### Accessing Route Parameters

```vue
<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute('/projects/[slug]')

// Access parameter
const slug = route.params.slug

// Safe access with optional chaining
const safeSlug = route.params?.slug
</script>

<template>
  <div>
    <h1>Project: {{ route.params?.slug }}</h1>
  </div>
</template>
```

### Dynamic Route File

**File:** `src/pages/projects/[slug].vue`

```vue
<script setup lang="ts">
const route = useRoute('/projects/[slug]')
const slug = route.params.slug
</script>

<template>
  <div>Project: {{ slug }}</div>
</template>
```

## Lazy Loading Routes

### Code Splitting

Lazy load components to improve initial page load:

```typescript
const router = createRouter({
  routes: [
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/views/ProjectsView.vue')
    }
  ]
})
```

**Benefits:**
- Smaller initial bundle size
- Faster initial page load
- Components loaded on-demand

## Error Handling

### 404 Catch-All Route

**File:** `src/pages/[...catchAll].vue`

```vue
<script setup lang="ts">
</script>

<template>
  <div>
    <h1>404 Not Found</h1>
    <p>Page not found</p>
    <RouterLink to="/">Go Home</RouterLink>
  </div>
</template>
```

### Manual 404 Route

```typescript
{
  path: '/:catchAll(.*)*',
  name: 'not-found',
  component: () => import('@/views/NotFoundView.vue')
}
```

## Active Link Styling

### RouterLink Active Classes

```vue
<template>
  <RouterLink 
    to="/projects"
    active-class="text-primary bg-muted"
    exact-active-class="text-primary font-bold"
  >
    Projects
  </RouterLink>
</template>
```

## Suspense Integration

### RouterView with Suspense

Wrap RouterView with Suspense to handle async component loading:

**File:** `app.vue`

```vue
<template>
  <AuthLayout>
    <RouterView v-slot="{ Component, route }">
      <Suspense v-if="Component" :timeout="0">
        <Component v-if="Component" :is="Component" :key="route.name"></Component>
        <template #fallback>
          <span>Loading...</span>
        </template>
      </Suspense>
    </RouterView>
  </AuthLayout>
</template>
```

### Top-Level Await in Pages

Use top-level await in page components for Suspense:

**File:** `src/pages/projects/index.vue`

```typescript
const getProjects = async () => {
  const { data, error } = await projectsQuery
  if (error) console.log(error)
  projects.value = data
}

// Top-level await - Suspense handles loading state
await getProjects()
```

## Route Guards

### Navigation Guards

```typescript
// Global before guard with async session check
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  await authStore.getSession()
  const isAuthPage = ['/login', '/register'].includes(to.path)

  if (!authStore.user && !isAuthPage) {
    return {
      name: '/login',
    }
  }

  if (authStore.user && isAuthPage) {
    return {
      name: '/',
    }
  }
})

// Global after hook
router.afterEach((to, from) => {
  // Clear errors, analytics, etc.
  errorStore.clearError()
})
```

### Route Meta Fields

```typescript
{
  path: '/dashboard',
  name: 'dashboard',
  component: DashboardView,
  meta: {
    requiresAuth: true,
    title: 'Dashboard'
  }
}
```

## Best Practices

1. **Use file-based routing** for automatic route generation
2. **Lazy load routes** for better performance
3. **Use RouterLink** instead of anchor tags
4. **Type-safe routes** with unplugin-vue-router
5. **Handle 404s** with catch-all routes
6. **Use route params safely** with optional chaining
7. **Organize pages** by feature in subdirectories

## Common Gotchas

1. **Route parameter types:** Use `useRoute('/path/[param]')` for type safety
2. **Lazy loading:** Components must be default exports
3. **Catch-all routes:** Must be last in route array
4. **RouterView:** Must be included in template for routes to render
5. **Navigation:** Use `router.push()` not `window.location`

## References

- [Vue Router Documentation](https://router.vuejs.org/)
- [unplugin-vue-router](https://github.com/posva/unplugin-vue-router)
