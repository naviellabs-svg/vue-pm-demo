# Frontend: Composables Patterns

## Overview

Patterns for creating reusable Vue composables that encapsulate logic, manage state, and provide clean APIs for components.

## When to Use

- ✅ Extracting reusable logic from components
- ✅ Managing shared state without Pinia
- ✅ Creating data fetching utilities
- ✅ Building complex interactive features
- ✅ Encapsulating API interactions

## Basic Composable Pattern

### Structure

```typescript
import { ref, computed } from 'vue'

export const useFeature = () => {
  // State
  const data = ref<DataType | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // Computed
  const hasData = computed(() => data.value !== null)

  // Methods
  const fetchData = async () => {
    loading.value = true
    try {
      // Fetch logic
      data.value = await api.getData()
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }

  // Return public API
  return {
    data,
    loading,
    error,
    hasData,
    fetchData
  }
}
```

## Batch Data Fetching Pattern

### Grouped Data Composable

**File:** `src/composables/collabs.ts`

```typescript
import { ref } from 'vue'
import { groupedProfilesQuery } from '@/utils/supaQueries'
import type { GroupedCollabs } from '@/types/GroupedCollabs'
import type { Projects, TasksWithProjects } from '@/utils/supaQueries'

export const useCollabs = () => {
  // Reactive state: stores collaborators grouped by item ID
  const groupedCollabs = ref<GroupedCollabs>({})

  // Helper: fetch profiles for a single array of user IDs
  const getProfilesByIds = async (userIds: string[]) => {
    const { data, error } = await groupedProfilesQuery(userIds)
    if (error || !data) return []
    return data
  }

  // Main function: batch-fetch collaborators for all items
  const getGroupedCollabs = async (items: Projects | TasksWithProjects) => {
    // Step 1: Filter only items that have collaborators
    const filteredItems = items.filter((item) => item.collaborators.length)

    // Step 2: Create an array of promises (one per item)
    const promises = filteredItems.map((item) => 
      getProfilesByIds(item.collaborators)
    )

    // Step 3: Execute all requests in parallel
    const results = await Promise.all(promises)

    // Step 4: Store results in groupedCollabs, keyed by item ID
    filteredItems.forEach((item, index) => {
      groupedCollabs.value[item.id] = results[index] ?? []
    })
  }

  return {
    getProfilesByIds,
    getGroupedCollabs,
    groupedCollabs
  }
}
```

### Usage

```vue
<script setup lang="ts">
const { getGroupedCollabs, groupedCollabs } = useCollabs()

await getProjects()
await getGroupedCollabs(projects.value)

// Access collaborators for a specific project
const projectId = 'some-project-id'
const collaborators = groupedCollabs.value[projectId]
</script>
```

## Non-Blocking Data Fetching

### Background Fetch Pattern

Fire data fetching without blocking page render:

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

await getProjects() // Block until projects load

// Don't await - let it run in background
getGroupedCollabs(projects.value) // Non-blocking

// groupedCollabs will update reactively when data arrives
</script>
```

## Composable with Type Safety

### Generic Composable

```typescript
import { ref, type Ref } from 'vue'

export const useAsyncData = <T>(
  fetcher: () => Promise<T>
) => {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const execute = async () => {
    loading.value = true
    error.value = null
    
    try {
      data.value = await fetcher()
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }

  return {
    data: data as Ref<T | null>,
    loading,
    error,
    execute
  }
}
```

**Usage:**

```typescript
const { data, loading, error, execute } = useAsyncData(() => 
  supabase.from('projects').select()
)

await execute()
```

## Composable Best Practices

### 1. Single Responsibility

Each composable should handle one concern:

```typescript
// ✅ Good: Single responsibility
export const useCollabs = () => { /* collaborator logic */ }
export const useProjects = () => { /* project logic */ }

// ❌ Bad: Multiple responsibilities
export const useData = () => { /* projects + collabs + tasks */ }
```

### 2. Return Reactive State

Always return refs/computed for reactivity:

```typescript
// ✅ Good: Returns reactive refs
return {
  data: ref([]),
  loading: ref(false)
}

// ❌ Bad: Returns plain values
return {
  data: [],
  loading: false
}
```

### 3. Handle Errors

Always handle errors in composables:

```typescript
const fetchData = async () => {
  try {
    const { data, error } = await query()
    if (error) {
      error.value = error
      return
    }
    data.value = data
  } catch (err) {
    error.value = err as Error
  }
}
```

### 4. Type Safety

Use TypeScript for type safety:

```typescript
export const useCollabs = (): {
  groupedCollabs: Ref<GroupedCollabs>
  getGroupedCollabs: (items: Projects | TasksWithProjects) => Promise<void>
} => {
  // Implementation
}
```

## Common Patterns

### Loading State Pattern

```typescript
export const useDataLoader = () => {
  const loading = ref(false)
  const data = ref(null)

  const load = async () => {
    loading.value = true
    try {
      data.value = await fetchData()
    } finally {
      loading.value = false
    }
  }

  return { loading, data, load }
}
```

### Error Handling Pattern

```typescript
export const useErrorHandler = () => {
  const error = ref<Error | null>(null)

  const handleError = (err: unknown) => {
    error.value = err instanceof Error ? err : new Error(String(err))
  }

  const clearError = () => {
    error.value = null
  }

  return { error, handleError, clearError }
}
```

### Debounced Search Pattern

```typescript
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

export const useSearch = () => {
  const query = ref('')
  const results = ref([])

  const search = useDebounceFn(async (searchQuery: string) => {
    if (!searchQuery) {
      results.value = []
      return
    }
    results.value = await performSearch(searchQuery)
  }, 300)

  watch(query, (newQuery) => {
    search(newQuery)
  })

  return { query, results }
}
```

## Best Practices

1. **Naming:** Use `use` prefix (e.g., `useCollabs`, `useProjects`)
2. **State management:** Use refs for reactive state
3. **Error handling:** Always handle errors gracefully
4. **Type safety:** Type all parameters and return values
5. **Single responsibility:** One composable, one concern
6. **Reusability:** Make composables generic when possible
7. **Documentation:** Document complex logic with comments

## Common Gotchas

1. **Reactivity:** Must return refs/computed, not plain values
2. **Async operations:** Handle loading and error states
3. **Memory leaks:** Clean up watchers/subscriptions if needed
4. **Type inference:** Explicitly type complex return types
5. **State sharing:** Each component gets its own instance unless using singleton pattern

## References

- [Vue Composables Guide](https://vuejs.org/guide/reusability/composables.html)
- [Composables Best Practices](https://vuejs.org/guide/reusability/composables.html#conventions-and-best-practices)
