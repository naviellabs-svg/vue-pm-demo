# Frontend: Pinia Store Patterns

## Overview

Patterns for state management with Pinia, including store setup, data loading with caching, cache invalidation, and reactive state patterns.

## When to Use

- ✅ Global application state
- ✅ Shared data across components
- ✅ Data caching and memoization
- ✅ Centralized data loading logic
- ✅ State that needs persistence

## Basic Store Setup

### Store Structure

**File:** `src/stores/loaders/projects.ts`

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { projectsQuery } from '@/utils/supaQueries'
import type { Projects } from '@/utils/supaQueries'

export const useProjectsStore = defineStore('projects-store', () => {
  // State
  const projects = ref<Projects | null>(null)

  // Actions
  const getProjects = async () => {
    const { data, error, status } = await projectsQuery
    
    if (error) {
      useErrorStore().setError({ error, customCode: status })
      return
    }
    
    if (data) {
      projects.value = data
    }
  }

  // Return public API
  return {
    projects,
    getProjects
  }
})
```

### Usage in Component

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useProjectsStore } from '@/stores/loaders/projects'

const projectsStore = useProjectsStore()
const { projects } = storeToRefs(projectsStore)
const { getProjects } = projectsStore

await getProjects()
</script>

<template>
  <div v-if="projects">
    <!-- Use projects -->
  </div>
</template>
```

## Caching with useMemoize

### Memoized Loader Pattern

**File:** `src/stores/loaders/projects.ts`

```typescript
import { useMemoize } from '@vueuse/core'
import { projectsQuery, projectQuery } from '@/utils/supaQueries'

export const useProjectsStore = defineStore('projects-store', () => {
  const projects = ref<Projects | null>(null)
  const project = ref<Project | null>(null)

  // Memoized loader for all projects (cached by key)
  const loadProjects = useMemoize(async (key: string) => await projectsQuery)

  // Memoized loader for single project (caches by slug)
  const loadProject = useMemoize(async (slug: string) => await projectQuery(slug))

  const getProjects = async () => {
    projects.value = null // Reset before fetching

    const { data, error, status } = await loadProjects('projects')
    
    if (error) {
      useErrorStore().setError({ error, customCode: status })
      return
    }
    
    if (data) {
      projects.value = data
    }
  }

  const getProject = async (slug: string) => {
    project.value = null // Reset before fetching

    const { data, error, status } = await loadProject(slug)
    
    if (error) {
      useErrorStore().setError({ error, customCode: status })
      return
    }
    
    if (data) {
      project.value = data
    }
  }

  return {
    projects,
    project,
    getProjects,
    getProject
  }
})
```

### How useMemoize Works

```typescript
const loadProject = useMemoize(async (slug: string) => await projectQuery(slug))

// First call: fetches from API, caches result
await getProject('my-project')

// Second call: returns cached result immediately
await getProject('my-project')

// Different slug: fetches new data, caches separately
await getProject('other-project')
```

## Cache Invalidation Pattern

### Reusable Cache Validation

**File:** `src/stores/loaders/projects.ts`

```typescript
interface ValidateCacheParams {
  ref: typeof projects | typeof project
  query: typeof projectsQuery | typeof projectQuery
  key: string
  loaderFn: typeof loadProjects | typeof loadProject
}

const validateCache = ({ ref, query, key, loaderFn }: ValidateCacheParams) => {
  if (!ref.value) return

  const finalQuery = typeof query === 'function' ? query(key) : query

  finalQuery.then(({ data, error }) => {
    // If data matches what we already have, do nothing
    if (JSON.stringify(ref.value) === JSON.stringify(data)) return

    // If data changed, invalidate memoized cache and update state
    loaderFn.delete(key)
    if (!error && data) ref.value = data
  })
}

const getProjects = async () => {
  projects.value = null

  const { data, error, status } = await loadProjects('projects')
  
  if (error) {
    useErrorStore().setError({ error, customCode: status })
    return
  }
  
  if (data) {
    projects.value = data
  }

  // Validate cache in background
  validateCache({
    ref: projects,
    query: projectsQuery,
    key: 'projects',
    loaderFn: loadProjects
  })
}
```

## Update Operations

### Update Function Pattern

**File:** `src/stores/loaders/projects.ts`

```typescript
import { updateProjectQuery } from '@/utils/supaQueries'

const updateProject = async () => {
  if (!project.value) return

  // Extract only project properties, exclude tasks and id
  const { tasks, id, ...projectProperties } = project.value

  const { error, status } = await updateProjectQuery(projectProperties, project.value.id)

  if (error) {
    useErrorStore().setError({ error, customCode: status })
    return
  }

  // Optionally invalidate cache after update
  loadProject.delete(project.value.slug)
}

return {
  // ... other exports
  updateProject
}
```

### Usage

```vue
<script setup lang="ts">
const projectsStore = useProjectsStore()
const { project } = storeToRefs(projectsStore)
const { updateProject } = projectsStore
</script>

<template>
  <AppInPlaceEditText 
    v-model="project.name" 
    @commit="updateProject" 
  />
</template>
```

## Page Store Pattern

### Dynamic Page Title Store

**File:** `src/stores/page.ts`

```typescript
import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'

export const usePageStore = defineStore('page-store', () => {
  const pageData = ref({
    title: ''
  })

  return {
    pageData
  }
})

// Hot Module Replacement
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePageStore, import.meta.hot))
}
```

### Usage with Watcher

```vue
<script setup lang="ts">
import { watch } from 'vue'
import { usePageStore } from '@/stores/page'

const projectsStore = useProjectsStore()
const { project } = storeToRefs(projectsStore)

watch(
  () => project.value?.name,
  () => {
    usePageStore().pageData.title = `Project: ${project.value?.name || ''}`
  }
)
</script>
```

## Error Store Pattern

### Global Error Handling

**File:** `src/stores/error.ts`

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PostgrestError } from '@supabase/supabase-js'
import type { CustomError } from '@/types/Error'

export const useErrorStore = defineStore('error-store', () => {
  const activeError = ref<null | CustomError | PostgrestError>(null)
  const isCustomError = ref(false)

  const setError = ({ 
    error, 
    customCode 
  }: { 
    error: string | PostgrestError | Error
    customCode?: number 
  }) => {
    if (typeof error === 'string' || error instanceof Error) {
      activeError.value = typeof error === 'string' ? Error(error) : error
      activeError.value.customCode = customCode || 500
      isCustomError.value = true
      return
    }

    activeError.value = error
    isCustomError.value = false
  }

  const clearError = () => {
    activeError.value = null
    isCustomError.value = false
  }

  return {
    activeError,
    isCustomError,
    setError,
    clearError
  }
})
```

## Best Practices

1. **Store organization:** Group related stores in folders (`stores/loaders/`, `stores/auth/`)
2. **State initialization:** Use `null` for unloaded state, not empty arrays/objects
3. **Cache invalidation:** Reset state before fetching new data
4. **Error handling:** Centralize error handling in error store
5. **Type safety:** Type all state and actions
6. **HMR support:** Add HMR updates for development
7. **Reactive refs:** Use `storeToRefs()` to maintain reactivity

## Common Gotchas

1. **Reactivity:** Use `storeToRefs()` when destructuring reactive state
2. **Cache keys:** Use consistent keys for memoization
3. **State reset:** Reset to `null` before fetching to trigger watchers
4. **Type safety:** Type store return values explicitly
5. **Memory:** Clear caches when no longer needed

## References

- [Pinia Documentation](https://pinia.vuejs.org/)
- [VueUse useMemoize](https://vueuse.org/core/usememoize/)
