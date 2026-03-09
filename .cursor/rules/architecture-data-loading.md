# Architecture: Data Loading and Caching Patterns

## Overview

Patterns for efficient data loading, caching strategies, cache invalidation, and performance optimization in Vue.js applications.

## When to Use

- ✅ Data that might be accessed multiple times
- ✅ Improving perceived performance
- ✅ Reducing API calls
- ✅ Implementing stale-while-revalidate pattern
- ✅ Background data synchronization

## Caching with useMemoize

### Pattern

Use `useMemoize` from VueUse to cache API responses:

```typescript
import { useMemoize } from '@vueuse/core'

const loadProject = useMemoize(async (slug: string) => {
  return await projectQuery(slug)
})

// First call: fetches and caches
const project1 = await loadProject('project-1')

// Second call: returns cached result
const project2 = await loadProject('project-1') // Instant!

// Different key: fetches new data
const project3 = await loadProject('project-2')
```

### Store Implementation

**File:** `src/stores/loaders/projects.ts`

```typescript
import { useMemoize } from '@vueuse/core'

export const useProjectsStore = defineStore('projects-store', () => {
  const projects = ref<Projects | null>(null)
  const project = ref<Project | null>(null)

  // Cache by key
  const loadProjects = useMemoize(async (key: string) => await projectsQuery)

  // Cache by slug
  const loadProject = useMemoize(async (slug: string) => await projectQuery(slug))

  const getProjects = async () => {
    projects.value = null // Reset for watchers

    const { data, error, status } = await loadProjects('projects')
    
    if (error) {
      useErrorStore().setError({ error, customCode: status })
      return
    }
    
    if (data) {
      projects.value = data
    }
  }

  return {
    projects,
    getProjects
  }
})
```

## Stale-While-Revalidate Pattern

### Cache Validation

Validate cache in background while serving cached data:

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

  // Run validation in background (don't await)
  finalQuery.then(({ data, error }) => {
    // If data matches, do nothing
    if (JSON.stringify(ref.value) === JSON.stringify(data)) return

    // If data changed, invalidate cache and update
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

### Benefits

- **Fast UI:** Cached data returns immediately
- **Fresh data:** Background validation ensures data stays current
- **Efficient:** Only updates if data actually changed

## Non-Blocking Data Loading

### Background Fetch Pattern

Load data without blocking page render:

```typescript
export const useCollabs = () => {
  const groupedCollabs = ref<GroupedCollabs>({})

  const getGroupedCollabs = async (items: Projects | TasksWithProjects) => {
    // Implementation...
  }

  return {
    getGroupedCollabs,
    groupedCollabs
  }
}
```

**Usage:**

```vue
<script setup lang="ts">
const { getGroupedCollabs, groupedCollabs } = useCollabs()

// Block until projects load
await getProjects()

// Don't await - runs in background
getGroupedCollabs(projects.value) // Non-blocking

// groupedCollabs updates reactively when data arrives
</script>

<template>
  <!-- Show skeleton while loading -->
  <div v-if="!groupedCollabs[projectId]">
    <SkeletonAvatar />
  </div>
  
  <!-- Show data when loaded -->
  <Avatar v-else :src="groupedCollabs[projectId][0].avatar_url" />
</template>
```

## Batch Data Fetching

### Parallel Requests Pattern

Fetch multiple related data items in parallel:

```typescript
export const useCollabs = () => {
  const groupedCollabs = ref<GroupedCollabs>({})

  const getGroupedCollabs = async (items: Projects | TasksWithProjects) => {
    // Filter items with collaborators
    const filteredItems = items.filter((item) => item.collaborators.length)

    // Create promises array
    const promises = filteredItems.map((item) => 
      getProfilesByIds(item.collaborators)
    )

    // Execute all in parallel
    const results = await Promise.all(promises)

    // Store results keyed by item ID
    filteredItems.forEach((item, index) => {
      groupedCollabs.value[item.id] = results[index] ?? []
    })
  }

  return {
    getGroupedCollabs,
    groupedCollabs
  }
}
```

### Performance Benefits

- **Sequential:** `n × request_time` (slow)
- **Parallel:** `request_time` (fast)

## Loading States

### Skeleton Pattern

Show loading placeholders while data loads:

```vue
<template>
  <div v-if="loading">
    <SkeletonAvatar />
    <SkeletonText />
  </div>
  
  <div v-else-if="data">
    <Avatar :src="data.avatar_url" />
    <p>{{ data.name }}</p>
  </div>
</template>
```

### Reactive Loading State

```typescript
export const useDataLoader = () => {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const load = async () => {
    loading.value = true
    try {
      data.value = await fetchData()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, load }
}
```

## Cache Invalidation

### Manual Invalidation

```typescript
// Invalidate specific cache entry
loadProject.delete('project-slug')

// Invalidate all cache
loadProjects.cache.clear()
```

### Automatic Invalidation on Update

```typescript
const updateProject = async () => {
  if (!project.value) return

  const { tasks, id, ...projectProperties } = project.value

  const { error } = await updateProjectQuery(
    projectProperties,
    project.value.id
  )

  if (error) {
    useErrorStore().setError({ error })
    return
  }

  // Invalidate cache after update
  loadProject.delete(project.value.slug)
  
  // Optionally refetch
  await getProject(project.value.slug)
}
```

## State Reset Pattern

### Reset Before Fetch

Reset state to trigger watchers and show loading state:

```typescript
const getProject = async (slug: string) => {
  // Reset to null to trigger watchers
  project.value = null

  const { data, error, status } = await loadProject(slug)

  if (error) {
    useErrorStore().setError({ error, customCode: status })
    return
  }

  if (data) {
    project.value = data
  }
}
```

**Why reset?**
- Watchers detect change from `null` → data
- Loading states work correctly
- Prevents stale data issues

## Best Practices

1. **Cache by key:** Use meaningful cache keys (slug, ID, etc.)
2. **Reset state:** Set to `null` before fetching for watchers
3. **Background validation:** Use stale-while-revalidate for fresh data
4. **Parallel requests:** Use `Promise.all()` for batch operations
5. **Loading states:** Show skeletons/placeholders while loading
6. **Error handling:** Always handle errors gracefully
7. **Cache invalidation:** Clear cache after updates

## Common Gotchas

1. **Watcher timing:** Reset state before fetch to trigger watchers
2. **Cache keys:** Use consistent keys for same data
3. **Memory:** Clear caches when no longer needed
4. **Race conditions:** Handle multiple simultaneous requests
5. **Type safety:** Type cached data properly

## References

- [VueUse useMemoize](https://vueuse.org/core/usememoize/)
- [Stale-While-Revalidate](https://web.dev/stale-while-revalidate/)
