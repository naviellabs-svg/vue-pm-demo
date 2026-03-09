# Chapter 8: Advanced Vue.js Patterns

## Lesson 8.100 - Fetch and Collect Collaborators Across All Projects

> **Purpose:** Create a reusable composable that efficiently fetches collaborator profiles for multiple projects/tasks in parallel, then groups them by item ID for easy lookup. This avoids making individual API calls for each project/task and provides a centralized way to access collaborator data.

### Overview

Instead of fetching collaborator profiles one-by-one for each project or task, we batch all the requests using `Promise.all()` and store the results in a reactive object keyed by item ID. This pattern is useful when displaying lists where each item needs associated user data.

---

### Step 1: Create the GroupedCollabs Type

**File:** `src/types/GroupedCollabs.ts`

> **Purpose:** Define a type that maps item IDs (project/task IDs) to their associated collaborator profiles.

#### Tasks

- [x] Create new file `src/types/GroupedCollabs.ts`
- [x] Import the `Collabs` type from `@/utils/supaQueries`
- [x] Define `GroupedCollabs` as an object with string keys (item IDs) and `Collabs` array values

```typescript
import type { Collabs } from '@/utils/supaQueries'

export type GroupedCollabs = {
  [key: string]: Collabs // Maps item ID → array of collaborator profiles
}
```

**Explanation:** This type represents a dictionary where:

- **Key:** The ID of a project or task (as a string)
- **Value:** An array of collaborator profile objects (username, avatar_url, id, full_name)

---

### Step 2: Update the Collabs Composable

**File:** `src/composables/collabs.ts`

> **Purpose:** Add state management and a function to batch-fetch and group collaborators for multiple items at once.

#### Tasks

- [x] Import the new `GroupedCollabs` type
- [x] Import `Projects` and `TasksWithProjects` types from `@/utils/supaQueries`
- [x] Create a reactive state `groupedCollabs` to store the grouped results
- [x] Create `getGroupedCollabs` function that:
  - Filters items that have collaborators
  - Maps each item to a promise that fetches its collaborators
  - Uses `Promise.all()` to fetch all in parallel
  - Stores results in `groupedCollabs` keyed by item ID
- [x] Return the new function and state from the composable

**Final Implementation:**

```typescript
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
    const promises = filteredItems.map((item) => getProfilesByIds(item.collaborators))

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

**Key Points:**

- **Why filter first?** We only process items with collaborators to avoid unnecessary API calls
- **Why `Promise.all()`?** Fetches all collaborator data in parallel instead of sequentially (much faster)
- **Why `?? []`?** Handles cases where a promise might return `undefined` (TypeScript safety)
- **Why store by ID?** Makes it easy to look up collaborators for a specific project/task: `groupedCollabs.value[projectId]`

---

### Step 3: Use in Projects Page

**File:** `src/pages/projects/index.vue`

> **Purpose:** Replace individual collaborator fetching with the new batch-fetching function.

#### Tasks

- [x] Import `getGroupedCollabs` and `groupedCollabs` from `useCollabs()`
- [x] Call `getGroupedCollabs()` with the projects data after fetching projects
- [x] The `groupedCollabs` reactive object is now available for use in the component

```typescript
const { getGroupedCollabs, groupedCollabs } = useCollabs()

await getProjects() // Fetch projects first
await getGroupedCollabs(projects.value) // Then fetch all collaborators

console.log('TEST :: ', groupedCollabs) // Check the grouped results
```

**Usage Example:**

```typescript
// Access collaborators for a specific project
const projectId = 'some-project-id'
const collaborators = groupedCollabs.value[projectId] // Array of collaborator profiles
```

---

### Notes / Learnings

#### Why This Pattern?

- **Performance:** `Promise.all()` fetches all collaborator data in parallel, reducing total wait time from `n × request_time` to just `request_time`
- **Reusability:** The composable can work with both `Projects` and `TasksWithProjects` types
- **State Management:** Centralized storage makes collaborator data accessible throughout the component lifecycle

#### Gotchas & Solutions

1. **Type Safety:** The `results[index] ?? []` pattern prevents TypeScript errors when a promise might return undefined
2. **Filtering:** Always filter items with collaborators first, otherwise you'll create empty promises
3. **Index Matching:** Using `filteredItems.forEach` ensures the index matches between filtered items and results array

#### When to Use This Pattern

- ✅ When you need to fetch related data for multiple items in a list
- ✅ When the related data comes from a different table/endpoint
- ✅ When you want to avoid N+1 query problems
- ❌ Don't use if you only need data for a single item (use `getProfilesByIds` directly)

#### Next Steps

- Use `groupedCollabs` in table columns to display collaborator avatars
- Consider adding error handling for failed requests
- Could add caching/memoization if collaborators don't change frequently

---

## Lesson 8.93 - Create Dynamic User Profiles

> **Purpose:** Create dynamic user profile pages that fetch and display user data based on username route parameter.

### Overview

Set up a user profile page that dynamically loads profile data based on the username in the URL, enabling user profile viewing functionality.

---

### Step 1: Create Profile Query

**File:** `src/utils/supaQueries.ts`

#### Tasks

- [ ] Update profile query to be dynamic:

```typescript
export const profileQuery = ({ column, value }: { column: string; value: string }) => {
  return supabase.from('profiles').select().eq(column, value).single()
}
```

---

### Step 2: Create User Profile Page

**File:** `src/pages/users/[username].vue`

#### Tasks

- [ ] Get username from route: `const { username } = useRoute('/users/[username]').params`
- [ ] Create profile ref: `const profile = ref<Tables<'profiles'> | null>(null)`
- [ ] Create getProfile function:

```typescript
const getProfile = async () => {
  const { data, error, status } = await profileQuery({ column: 'username', value: username })
  if (error) useErrorStore().setError({ error, customCode: status })
  profile.value = data
}

await getProfile()
```

---

## Lesson 8.94 - Using Pinia for Efficient Data Loading and Caching

> **Purpose:** Move data loading logic to Pinia stores for centralized state management and caching.

### Overview

Extract data fetching logic from components into Pinia stores, enabling better state management and preparing for caching strategies.

---

### Step 1: Create Projects Store

**File:** `src/stores/loaders/projects.ts`

#### Tasks

- [ ] Create store:

```typescript
import { projectsQuery } from '@/utils/supaQueries'
import type { Projects } from '@/utils/supaQueries'

export const useProjectsStore = defineStore('projects-store', () => {
  const projects = ref<Projects | null>(null)

  const getProjects = async () => {
    const { data, error, status } = await projectsQuery
    if (error) useErrorStore().setError({ error, customCode: status })
    if (data) projects.value = data
  }

  return {
    projects,
    getProjects
  }
})
```

---

### Step 2: Update Projects Page

**File:** `src/pages/projects/index.vue`

#### Tasks

- [ ] Use store:

```typescript
const projectsLoader = useProjectsStore()
const { projects } = storeToRefs(projectsLoader)
const { getProjects } = projectsLoader

await getProjects()
```

- [ ] Add caching check: `if (projects.value?.length) return`

---

## Lesson 8.95 - Use useMemoize from VueUse to Optimize Pinia Loader Functions

> **Purpose:** Implement caching using VueUse's useMemoize to prevent redundant API calls.

### Overview

Use `useMemoize` from VueUse to cache API responses, ensuring that repeated calls with the same parameters return cached data instead of making new requests.

---

### Step 1: Install VueUse

**Location:** Terminal

#### Tasks

- [ ] Install: `npm install @vueuse/core`

---

### Step 2: Update Projects Store

**File:** `src/stores/loaders/projects.ts`

#### Tasks

- [ ] Import useMemoize: `import { useMemoize } from '@vueuse/core'`
- [ ] Create memoized loader:

```typescript
const loadProjects = useMemoize(async (key: string) => await projectsQuery)

const getProjects = async () => {
  const { data, error, status } = await loadProjects('projects')
  if (error) useErrorStore().setError({ error, customCode: status })
  if (data) projects.value = data
}
```

---

## Lesson 8.96 - Implement Stale While Revalidate with Pinia and useMemoize

> **Purpose:** Implement stale-while-revalidate pattern to show cached data immediately while fetching fresh data in the background.

### Overview

Return cached data immediately for fast UI, then validate it against fresh data in the background and update if changes are detected.

---

### Step 1: Add Cache Validation

**File:** `src/stores/loaders/projects.ts`

#### Tasks

- [ ] Create validateCache function:

```typescript
const validateCache = () => {
  if (projects.value?.length) {
    projectsQuery.then(({ data, error }) => {
      if (JSON.stringify(projects.value) === JSON.stringify(data)) {
        return // Data matches, no update needed
      } else {
        loadProjects.delete('projects') // Invalidate cache
        if (!error && data) projects.value = data // Update with fresh data
      }
    })
  }
}
```

- [ ] Call validateCache after initial load in getProjects

---

## Lesson 8.97 - Update Stale Data with Fresh Data

> **Purpose:** Refine cache validation to properly update stale data without console logs.

### Overview

Clean up the cache validation function and ensure it properly updates data when changes are detected.

---

### Step 1: Clean Up Code

**File:** `src/stores/loaders/projects.ts`

#### Tasks

- [ ] Remove console.log statements
- [ ] Change initial state: `const projects = ref<Projects>([])`
- [ ] Ensure proper error handling and data updates

---

## Lesson 8.98 - Set Up ESLint 9 with Flat Config in Vue.js

> **Purpose:** Upgrade to ESLint 9 with the new flat config format for better configuration management.

### Overview

Migrate from ESLint 8's legacy config to ESLint 9's flat config format, which provides a more modern and flexible configuration system.

---

### Step 1: Update Dependencies

**Location:** Terminal

#### Tasks

- [ ] Update packages: `ncu --upgrade vue vue-tsc typescript prettier eslint-plugin-vue eslint @vue/eslint-config-typescript @vue/eslint-config-prettier @vitejs/plugin-vue`
- [ ] Delete package-lock.json and node_modules
- [ ] Run: `npm install`

---

### Step 2: Create ESLint Config

**File:** `eslint.config.js`

#### Tasks

- [ ] Create new config:

```typescript
import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  { name: 'app/files-to-lint', files: ['**/*.{ts,mts,tsx,vue}'] },
  { name: 'app/files-to-ignore', ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'] },
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  skipFormatting,
  { rules: { 'vue/multi-word-component-names': 0 } }
]
```

---

### Step 3: Configure Editor

**Files:** `.editorconfig`, `.vscode/settings.json`

#### Tasks

- [ ] Create `.editorconfig` file with formatting rules
- [ ] Update VS Code settings for file nesting and format on save

---

## Lesson 8.99 - Create a Vue.js Composable for Projects Collaborators

> **Purpose:** Create a composable function to fetch collaborator profiles by user IDs.

### Overview

Extract collaborator fetching logic into a reusable composable that can be used across multiple components.

---

### Step 1: Create Profile Query

**File:** `src/utils/supaQueries.ts`

#### Tasks

- [ ] Add grouped profiles query:

```typescript
export const groupedProfilesQuery = (userIds: string[]) =>
  supabase.from('profiles').select('username, avatar_url, id, full_name').in('id', userIds)

export type Collabs = QueryData<ReturnType<typeof groupedProfilesQuery>>
```

---

### Step 2: Create Collabs Composable

**File:** `src/composables/collabs.ts`

#### Tasks

- [ ] Create composable:

```typescript
import { groupedProfilesQuery } from '@/utils/supaQueries'

export const useCollabs = () => {
  const getProfilesByIds = async (userIds: string[]) => {
    const { data, error } = await groupedProfilesQuery(userIds)
    if (error || !data) return []
    return data
  }
  return {
    getProfilesByIds
  }
}
```

---

## Lesson 8.101 - Use Vue.js Render Functions to Render Collaborators

> **Purpose:** Convert static table columns into functions that accept collaborator data and use render functions to display avatars.

### Overview

Transform columns from static arrays to functions that receive reactive collaborator data, enabling dynamic avatar rendering in table cells.

---

### Step 1: Convert Columns to Function

**File:** `src/utils/tableColumns/projectsColumns.ts`

#### Tasks

- [ ] Change columns export to function:

```typescript
import type { Ref } from 'vue'
import type { GroupedCollabs } from '@/types/GroupedCollabs'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'

export const columns = (collabs: Ref<GroupedCollabs>): ColumnDef<Projects[0]>[] => [
  // ... existing columns
]
```

---

### Step 2: Update Collaborators Column

**File:** `src/utils/tableColumns/projectsColumns.ts`

#### Tasks

- [ ] Update collaborators column to use render functions:

```typescript
{
  accessorKey: 'collaborators',
  header: () => h('div', { class: 'text-left' }, 'Collaborators'),
  cell: ({ row }) => {
    const projectCollaborators = collabs.value[row.original.id]
    if (!projectCollaborators || projectCollaborators.length === 0) {
      return h('div', { class: 'text-left font-medium' }, '')
    }
    return h(
      'div',
      { class: 'text-left font-medium flex gap-2' },
      projectCollaborators.map((collab) => {
        return h(
          Avatar,
          { class: 'border border-primary' },
          () => h(AvatarImage, { src: collab.avatar_url || '', alt: collab.username || '' })
        )
      })
    )
  }
}
```

---

### Step 3: Use Function in Projects Page

**File:** `src/pages/projects/index.vue`

#### Tasks

- [ ] Call columns function: `const columnsWithCollabs = columns(groupedCollabs)`
- [ ] Pass to DataTable: `<DataTable :columns="columnsWithCollabs" :data="projects" />`

---

## Lesson 8.102 - Load Collaborators Without Blocking Page Render

> **Purpose:** Fetch collaborators in the background so the page renders immediately while data loads.

### Overview

Remove await from collaborator fetching to allow non-blocking data loading, improving perceived performance.

---

### Step 1: Update Projects Page

**File:** `src/pages/projects/index.vue`

#### Tasks

- [ ] Remove await: `getGroupedCollabs(projects.value)` (no await)
- [ ] Page renders immediately while collaborators load in background

---

### Step 2: Handle Loading States

**File:** `src/utils/tableColumns/projectsColumns.ts`

#### Tasks

- [ ] Add skeleton avatars for loading state:

```typescript
if (!projectCollaborators || projectCollaborators.length === 0) {
  return h(
    'div',
    { class: 'text-left font-medium flex gap-2' },
    row.original.collaborators.map(() =>
      h(Avatar, { class: 'animate-pulse' }, () => h(AvatarFallback))
    )
  )
}
```

---

## Lesson 8.103 - Reuse the Pinia Loader to Load Single Project

> **Purpose:** Centralize single project loading in Pinia store with caching support.

### Overview

Move single project fetching to the Pinia store, enabling caching and preventing redundant API calls when navigating back to previously viewed projects.

---

### Step 1: Add getProject to Store

**File:** `src/stores/loaders/projects.ts`

#### Tasks

- [ ] Add project state: `const project = ref<Project>()`
- [ ] Create memoized loader: `const loadProject = useMemoize(async (slug: string) => await projectQuery(slug))`
- [ ] Add getProject function:

```typescript
const getProject = async (slug: string) => {
  const { data, error, status } = await loadProject(slug)
  if (error) useErrorStore().setError({ error, customCode: status })
  if (data) project.value = data
}
```

- [ ] Export project and getProject

---

### Step 2: Update Component

**File:** `src/pages/projects/[slug].vue`

#### Tasks

- [ ] Use store:

```typescript
const projectsLoader = useProjectsStore()
const { project } = storeToRefs(projectsLoader)
const { getProject } = projectsLoader

await getProject(slug)
```

---

## Lesson 8.104 - Make Pinia Loader Cache Invalidation Reusable

> **Purpose:** Extract cache validation logic into a reusable function for both list and single-item queries.

### Overview

Create a generic validateCache function that works for both projects list and single project queries, reducing code duplication.

---

### Step 1: Create Reusable validateCache

**File:** `src/stores/loaders/projects.ts`

#### Tasks

- [ ] Create interface:

```typescript
interface ValidateCacheParams {
  ref: typeof projects | typeof project
  query: typeof projectsQuery | typeof projectQuery
  key: string
  loaderFn: typeof loadProjects | typeof loadProject
}
```

- [ ] Create function:

```typescript
const validateCache = ({ ref, query, key, loaderFn }: ValidateCacheParams) => {
  if (!ref.value) return
  const finalQuery = typeof query === 'function' ? query(key) : query
  finalQuery.then(({ data, error }) => {
    if (JSON.stringify(ref.value) === JSON.stringify(data)) return
    loaderFn.delete(key)
    if (!error && data) ref.value = data
  })
}
```

- [ ] Use in both getProjects and getProject

---

## Lesson 8.105 - Fix a Little Bug with the Project Title Watcher

> **Purpose:** Fix watcher not updating when navigating between projects by resetting ref to null before fetching.

### Overview

Reset project ref to null at the start of getProject to ensure watchers detect changes when navigating between different projects.

---

### Step 1: Reset Before Fetching

**File:** `src/stores/loaders/projects.ts`

#### Tasks

- [ ] Reset at start of functions:

```typescript
const getProjects = async () => {
  projects.value = null // Reset before fetching
  // ... rest of function
}

const getProject = async (slug: string) => {
  project.value = null // Reset before fetching - fixes watcher bug
  // ... rest of function
}
```

---

## Lesson 8.106 - Create Text Field Component with defineModel

> **Purpose:** Create a reusable in-place editing component using Vue 3's defineModel macro.

### Overview

Use Vue 3.3+ defineModel macro to create a simple text input component with two-way data binding for in-place editing.

---

### Step 1: Create Component

**File:** `src/components/AppInPlaceEdit/AppInPlaceEditText.vue`

#### Tasks

- [ ] Create component:

```vue
<script setup lang="ts">
const value = defineModel<string>()
</script>

<template>
  <input
    v-model="value"
    class="w-full p-1 bg-transparent focus:outline-none focus:border-none focus:bg-gray-800 focus:rounded-md"
    type="text"
  />
</template>
```

---

### Step 2: Use in Project Page

**File:** `src/pages/projects/[slug].vue`

#### Tasks

- [ ] Replace static text: `<AppInPlaceEditText v-model="project.name" />`

---

## Lesson 8.107 - Add Commit Event to In-Place Edit Component

> **Purpose:** Add commit event that fires when user finishes editing (blur or Enter key).

### Overview

Emit a commit event when editing is complete, allowing parent components to save changes to the database.

---

### Step 1: Add Commit Emit

**File:** `src/components/AppInPlaceEdit/AppInPlaceEditText.vue`

#### Tasks

- [ ] Add emit: `defineEmits(['commit'])`
- [ ] Add handlers:

```vue
<input
  v-model="value"
  @blur="$emit('commit')"
  @keypress.enter="($event.target as HTMLInputElement).blur()"
/>
```

---

### Step 2: Handle Commit in Parent

**File:** `src/pages/projects/[slug].vue`

#### Tasks

- [ ] Add handler: `<AppInPlaceEditText v-model="project.name" @commit="console.log('changed')" />`

---

## Lesson 8.108 - Update Project Title in the Database

> **Purpose:** Create function to persist project changes to Supabase database.

### Overview

Implement database update functionality to save project changes when users commit edits.

---

### Step 1: Create Update Query

**File:** `src/utils/supaQueries.ts`

#### Tasks

- [ ] Add update query:

```typescript
export const updateProjectQuery = (updatedProject = {}, id: number) => {
  return supabase.from('projects').update(updatedProject).eq('id', id)
}
```

---

### Step 2: Create Update Function in Store

**File:** `src/stores/loaders/projects.ts`

#### Tasks

- [ ] Add updateProject function:

```typescript
const updateProject = async () => {
  if (!project.value) return
  const { tasks, id, ...projectProperties } = project.value
  await updateProjectQuery(projectProperties, project.value.id)
}
```

- [ ] Export updateProject

---

### Step 3: Connect to Commit Event

**File:** `src/pages/projects/[slug].vue`

#### Tasks

- [ ] Update handler: `<AppInPlaceEditText v-model="project.name" @commit="updateProject" />`

---

## Lesson 8.109 - Create a Toggle Component for the Project Status

> **Purpose:** Create visual status indicator component with icons for completed vs in-progress.

### Overview

Create a status component that displays different icons based on project status using defineModel for two-way binding.

---

### Step 1: Create Status Component

**File:** `src/components/AppInPlaceEdit/AppInPlaceEditStatus.vue`

#### Tasks

- [ ] Create component:

```vue
<script setup lang="ts">
const value = defineModel<'in-progress' | 'completed'>()
</script>

<template>
  <div class="text-2xl cursor-pointer">
    <iconify-icon v-if="value === 'completed'" icon="lucide:circle-check" class="text-green-500" />
    <iconify-icon v-else icon="lucide:circle-dot" class="text-gray-500" />
  </div>
</template>
```

---

### Step 2: Use in Project Page

**File:** `src/pages/projects/[slug].vue`

#### Tasks

- [ ] Replace status display: `<AppInPlaceEditStatus v-model="project.status" />`

---

## Lesson 8.110 - Update the Project Status in the Database

> **Purpose:** Add toggle functionality and save status changes to database.

### Overview

Add click handler to toggle status and emit commit event to trigger database save.

---

### Step 1: Add Toggle Functionality

**File:** `src/components/AppInPlaceEdit/AppInPlaceEditStatus.vue`

#### Tasks

- [ ] Add toggle function:

```typescript
const emit = defineEmits(['commit'])

const toggleValue = () => {
  value.value = value.value === 'completed' ? 'in-progress' : 'completed'
  emit('commit')
}
```

- [ ] Add click handler: `@click="toggleValue"`

---

### Step 2: Connect to Update Function

**File:** `src/pages/projects/[slug].vue`

#### Tasks

- [ ] Add commit handler: `<AppInPlaceEditStatus v-model="project.status" @commit="updateProject" />`

---

## Lesson 8.111 - Use Vue.js Props Destructure to Assign Default Values for Props

> **Purpose:** Add readonly prop to prevent editing in certain contexts.

### Overview

Add a readonly prop with default value using props destructuring to control when status can be edited.

---

### Step 1: Add Readonly Prop

**File:** `src/components/AppInPlaceEdit/AppInPlaceEditStatus.vue`

#### Tasks

- [ ] Add prop with destructuring:

```typescript
const { readonly = false } = defineProps<{
  readonly?: boolean
}>()

const toggleValue = () => {
  if (readonly) return
  // ... rest of toggle logic
}
```

---

### Step 2: Use in Table

**File:** `src/utils/tableColumns/projectsColumns.ts`

#### Tasks

- [ ] Pass readonly: `h(AppInPlaceEditStatus, { modelValue: row.original.status, readonly: true })`

---

## Lesson 8.112 - Display Tasks in Project Detail Page with Navigation and Status

> **Purpose:** Replace placeholder task data with real data, add navigation links, and display status.

### Overview

Update project detail page to show actual task data with clickable links and visual status indicators.

---

### Step 1: Update Tasks Table

**File:** `src/pages/projects/[slug].vue`

#### Tasks

- [ ] Replace placeholder with real data:

```vue
<TableRow v-for="task in project.tasks" :key="task.id">
  <TableCell class="p-0">
    <RouterLink
      class="text-left block hover:bg-muted p-4"
      :to="{name: '/tasks/[id]', params: {id: task.id}}"
    >
      {{ task.name }}
    </RouterLink>
  </TableCell>
  <TableCell>
    <AppInPlaceEditStatus readonly :modelValue="task.status" />
  </TableCell>
  <TableCell>{{ task.due_date }}</TableCell>
</TableRow>
```

---

### Step 2: Add Dynamic Page Title to User Profile

**File:** `src/pages/users/[username].vue`

#### Tasks

- [ ] Add watcher:

```typescript
watch(
  () => profile.value?.full_name || profile.value?.username,
  (name) => {
    usePageStore().pageData.title = name ? `User: ${name}` : ''
  }
)
```

---

## Lesson 8.113 - Use defineModel with Textarea and Adjust the Database Schema

> **Purpose:** Create textarea component for editing descriptions and update database schema.

### Overview

Duplicate the text input component to create a textarea version and add description field to projects table.

---

### Step 1: Create Textarea Component

**File:** `src/components/AppInPlaceEdit/AppInPlaceTextarea.vue`

#### Tasks

- [ ] Duplicate AppInPlaceEditText.vue
- [ ] Change input to textarea:

```vue
<script setup lang="ts">
const value = defineModel<string>()
defineEmits(['commit'])
</script>

<template>
  <textarea
    class="w-full p-1 bg-transparent focus:outline-none focus:border-none focus:bg-gray-800 focus:rounded-md"
    v-model="value"
    @blur="$emit('commit')"
  />
</template>
```

---

### Step 2: Update Database Schema

**Location:** Migration file

#### Tasks

- [ ] Update projects schema: `description text not null default ''`
- [ ] Run: `npm run supabase:login`, `npm run db:reset`, `npm run supabase:types`, `npm run db:seed`

---

### Step 3: Use in Project Page

**File:** `src/pages/projects/[slug].vue`

#### Tasks

- [ ] Replace description: `<AppInPlaceTextarea v-model="project.description" @commit="updateProject" />`

---

### Notes / Learnings

- **Render Functions:** Use `h()` to programmatically create components in table cells
- **defineModel:** Simplifies two-way binding without manual props/emits
- **Cache Invalidation:** Reusable validateCache function works for both list and single-item queries
- **Non-Blocking Fetches:** Remove await to allow immediate rendering while data loads
- **Props Destructuring:** Use destructuring with defaults for cleaner prop handling
- **Pinia Stores:** Centralize data loading with caching for better performance
- **Stale-While-Revalidate:** Show cached data immediately, validate in background
