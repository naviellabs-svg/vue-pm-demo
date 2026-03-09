# Chapter 5: Advanced Vue.js Features

## Lesson 5.47 - Integrate unplugin-auto-import with Vue and Vite

> **Purpose:** Automatically import Vue composables and functions without manual imports.

### Overview

Configure unplugin-auto-import to automatically import Vue functions (ref, computed, watch, etc.) and Vue Router functions (useRoute, useRouter) without explicit import statements.

---

### Step 1: Install unplugin-auto-import

**Location:** Terminal

#### Tasks

- [ ] Follow installation instructions: https://github.com/unplugin/unplugin-auto-import/blob/main/README.md
- [ ] Install the package

---

### Step 2: Configure Vite

**File:** `vite.config.ts`

#### Tasks

- [ ] Import: `import AutoImport from 'unplugin-auto-import/vite'`
- [ ] Add plugin with configuration:

```typescript
AutoImport({
  include: [
    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
    /\.vue$/,
    /\.vue\?vue/, // .vue
    /\.vue\.[tj]sx?\?vue/, // .vue (vue-loader with experimentalInlineMatchResource enabled)
    /\.md$/, // .md
  ],
  imports: [
    // presets
    'vue',
    'vue-router',
  ],
  dts: true,
  viteOptimizeDeps: true,
})
```

---

### Step 3: Update TypeScript Config

**File:** `tsconfig.app.json`

#### Tasks

- [ ] Under `include` add: `"auto-imports.d.ts"` and `"components.d.ts"`

---

### Step 4: Remove Manual Imports

**Files:** Various component files

#### Tasks

- [ ] Delete `import { useRoute } from 'vue-router'` from projects/[slug].vue
- [ ] Delete `import { h, ref } from 'vue'` from projects/index.vue and tasks/index.vue
- [ ] Verify everything still works: `npm run dev`

---

## Lesson 5.48 - Configure unplugin-auto-import for unplugin-vue-router

> **Purpose:** Add Vue Router auto-imports specific to unplugin-vue-router.

### Overview

Configure auto-imports to include Vue Router functions from unplugin-vue-router for better type safety and route handling.

---

### Step 1: Update Vite Config

**File:** `vite.config.ts`

#### Tasks

- [ ] Import: `import { VueRouterAutoImports } from 'unplugin-vue-router'`
- [ ] Replace `'vue-router'` preset with `VueRouterAutoImports` in imports array

---

## Lesson 5.49 - Implement Components Auto Importing Feature in Vue.js 3

> **Purpose:** Automatically import Vue components without explicit import statements.

### Overview

Configure unplugin-vue-components to automatically import components from the components directory, eliminating the need for manual imports.

---

### Step 1: Install unplugin-vue-components

**Location:** Terminal

#### Tasks

- [ ] Go to: https://github.com/unplugin/unplugin-vue-components
- [ ] Install: `npm i unplugin-vue-components -D`

---

### Step 2: Configure Vite

**File:** `vite.config.ts`

#### Tasks

- [ ] Import: `import Components from 'unplugin-vue-components/vite'`
- [ ] Add plugin: `Components({ /* options */ })`

---

### Step 3: Update TypeScript Config

**File:** `tsconfig.app.json`

#### Tasks

- [ ] Under `include` add: `"components.d.ts"`

---

### Step 4: Remove Manual Component Imports

**Files:** Various component files

#### Tasks

- [ ] Delete component imports from DataTable.vue, Sidebar.vue, projects/index.vue, tasks/index.vue, app.vue
- [ ] Components will be auto-imported automatically

---

## Lesson 5.50 - Use Vue.js Suspense Component to Handle Async Dependencies

> **Purpose:** Understand how Suspense works with async components.

### Overview

Suspense allows components to handle async dependencies and show fallback content while loading.

---

### Notes

- Suspense is a built-in Vue component for handling async component loading
- Provides fallback UI while async operations complete
- Works with async setup functions and async components

---

## Lesson 5.51 - Enhance Vue Router with Suspense for Async Components

> **Purpose:** Integrate Suspense with Vue Router to handle async page components.

### Overview

Wrap RouterView with Suspense to show loading states while async page components load their data.

---

### Step 1: Update App.vue

**File:** `app.vue`

#### Tasks

- [ ] Update template:

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

---

### Step 2: Update Page Components

**Files:** `tasks/index.vue`, `projects/index.vue`

#### Tasks

- [ ] Use top-level await in script setup:

```typescript
const getProjects = async () => {
  const { data, error } = await projectsQuery
  if (error) console.log(error)
  projects.value = data
}

await getProjects()
```

---

## Lesson 5.52 - Dynamic Page Titles with Pinia

> **Purpose:** Create a Pinia store to manage dynamic page titles across the application.

### Overview

Create a centralized store for page metadata that can be updated from any component, with Hot Module Replacement support.

---

### Step 1: Create Page Store

**File:** `src/stores/page.ts`

#### Tasks

- [ ] Create store:

```typescript
import { acceptHMRUpdate, defineStore } from 'pinia'

export const usePageStore = defineStore('page-store', () => {
  const pageData = ref({
    title: ''
  })

  return {
    pageData
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePageStore, import.meta.hot))
}
```

---

### Step 2: Update AuthLayout

**File:** `src/components/layout/main/authLayout.vue`

#### Tasks

- [ ] Use storeToRefs to make pageData reactive:

```typescript
const { pageData } = storeToRefs(usePageStore())
```

- [ ] Update template:

```vue
<h1 class="text-lg font-semibold md:text-2xl">{{ pageData.title }}</h1>
```

---

### Step 3: Set Titles in Pages

**Files:** `pages/index.vue`, `projects/index.vue`, `tasks/index.vue`

#### Tasks

- [ ] Set page title: `usePageStore().pageData.title = 'Homepage'`

---

### Step 4: Configure Auto-Import

**File:** `vite.config.ts`

#### Tasks

- [ ] Update AutoImport configuration:

```typescript
imports: [
  'vue',
  VueRouterAutoImports,
  {
    pinia: ['defineStore', 'storeToRefs', 'acceptHMRUpdate']
  }
],
dts: true,
viteOptimizeDeps: true,
dirs: ['src/stores']
```

- [ ] Remove manual Pinia imports from components

---

## Lesson 5.53 - Retrieve Project Details for Tasks: Querying Nested Database Tables

> **Purpose:** Query related project data when fetching tasks using Supabase nested queries.

### Overview

Use Supabase's nested select syntax to fetch related project information along with tasks in a single query.

---

### Step 1: Update Tasks Query

**File:** `src/pages/tasks/index.vue`

#### Tasks

- [ ] Update query to include projects:

```typescript
const { data, error } = await supabase.from('tasks').select(`
  *,
  projects (
    id,
    name,
    slug
  )
`)
```

---

### Step 2: Update Columns

**File:** `src/pages/tasks/index.vue`

#### Tasks

- [ ] Add project column with RouterLink:

```typescript
{
  accessorKey: 'projects',
  header: () => h('div', { class: 'text-left' }, 'Project'),
  cell: ({ row }) => {
    return h(
      RouterLink,
      {
        to: `/projects/${row.original.projects.slug}`,
        class: 'text-left font-medium hover:bg-muted block w-full'
      },
      () => row.getValue('projects').name
    )
  }
}
```

---

## Lesson 5.54 - Handle Complex Supabase Queries

> **Purpose:** Create typed queries for complex nested Supabase queries with TypeScript support.

### Overview

Extract complex queries into typed constants and create TypeScript types for nested query results.

---

### Step 1: Create Typed Query

**File:** `src/pages/tasks/index.vue`

#### Tasks

- [ ] Create query constant:

```typescript
const tasksWithProjectsQuery = supabase.from('tasks').select(`
  *,
  projects (
    id,
    name,
    slug
  )
`)
```

- [ ] Create type:

```typescript
type TasksWithProjects = QueryData<typeof tasksWithProjectsQuery>
```

- [ ] Update ref: `const tasks = ref<TasksWithProjects | null>(null)`
- [ ] Update columns: `const columns: ColumnDef<TasksWithProjects[0]>[]`

---

### Step 2: Handle Null Projects

**File:** `src/pages/tasks/index.vue`

#### Tasks

- [ ] Add null check in project column cell:

```typescript
cell: ({ row }) => {
  return row.original.projects
    ? h(RouterLink, { to: `/projects/${row.original.projects.slug}`, ... }, () => row.original.projects?.name)
    : ' '
}
```

---

## Lesson 5.55 - Cleaning Time P1: Separating Supabase Queries and Types

> **Purpose:** Extract Supabase queries and types into a centralized utils file for better organization.

### Overview

Move all Supabase queries and their associated types to a dedicated `supaQueries.ts` file for reusability and maintainability.

---

### Step 1: Create Utils File

**File:** `src/utils/supaQueries.ts`

#### Tasks

- [ ] Create new file `supaQueries.ts`
- [ ] Move `tasksWithProjectsQuery` from tasks/index.vue
- [ ] Export query and type:

```typescript
export const tasksWithProjectsQuery = supabase.from('tasks').select(`
  *,
  projects (
    id,
    name,
    slug
  )
`)

export type TasksWithProjects = QueryData<typeof tasksWithProjectsQuery>
```

- [ ] Move `projectsQuery` from projects/index.vue:

```typescript
export const projectsQuery = supabase.from('projects').select()
export type Projects = QueryData<typeof projectsQuery>
```

---

### Step 2: Update Components

**Files:** `tasks/index.vue`, `projects/index.vue`

#### Tasks

- [ ] Import queries and types: `import { tasksWithProjectsQuery, TasksWithProjects } from '@/utils/supaQueries'`
- [ ] Update component to use imported queries

---

## Lesson 5.56 - Cleaning Time P2: Separating Column Definitions

> **Purpose:** Extract column definitions into separate files for better organization.

### Overview

Move table column definitions to dedicated files in `utils/tableColumns/` directory.

---

### Step 1: Create Column Files

**File:** `src/utils/tableColumns/tasksColumns.ts`

#### Tasks

- [ ] Create new file `tasksColumns.ts`
- [ ] Move columns definition from tasks/index.vue
- [ ] Export columns:

```typescript
export const columns: ColumnDef<TasksWithProjects[0]>[] = [
  // ... column definitions
]
```

---

### Step 2: Create Projects Columns

**File:** `src/utils/tableColumns/projectsColumns.ts`

#### Tasks

- [ ] Create new file `projectsColumns.ts`
- [ ] Move columns definition from projects/index.vue
- [ ] Export columns

---

### Step 3: Update Components

**Files:** `tasks/index.vue`, `projects/index.vue`

#### Tasks

- [ ] Import columns: `import { columns } from '@/utils/tableColumns/tasksColumns'`

---

## Lesson 5.57 - Fetch the Data for the Individual Project Page

> **Purpose:** Create a query to fetch a single project with its related tasks.

### Overview

Create a query function that fetches a project by slug along with its associated tasks using nested queries.

---

### Step 1: Create Project Query

**File:** `src/utils/supaQueries.ts`

#### Tasks

- [ ] Add project query:

```typescript
export const projectQuery = (slug: string) => supabase
  .from('projects')
  .select(`
    *,
    tasks(
      id,
      name,
      status,
      due_date
    )
  `)
  .eq('slug', slug)
  .single()

export type Project = QueryData<ReturnType<typeof projectQuery>>
```

---

### Step 2: Update Project Detail Page

**File:** `src/pages/projects/[slug].vue`

#### Tasks

- [ ] Create project ref: `const project = ref<Project | null>(null)`
- [ ] Create getProject function:

```typescript
const route = useRoute('/projects/[slug]')

const getProject = async () => {
  const { data, error } = await projectQuery(route.params.slug)
  if (error) console.log(error)
  project.value = data
}

await getProject()
```

---

### Step 3: Update Template

**File:** `src/pages/projects/[slug].vue`

#### Tasks

- [ ] Add `v-if="project"` to table
- [ ] Display project data: `{{ project.name }}`, `{{ project.description }}`, `{{ project.status }}`
- [ ] Loop over collaborators and tasks

---

## Lesson 5.58 - Use the Vue Watch API to Update Pinia Store with the Project Name

> **Purpose:** Use Vue's watch API to update page title when project data loads.

### Overview

Watch for changes to project name and update the page title store reactively.

---

### Step 1: Add Watcher

**File:** `src/pages/projects/[slug].vue`

#### Tasks

- [ ] Add watch:

```typescript
watch(
  () => project.value?.name,
  () => {
    usePageStore().pageData.title = `Project: ${project.value?.name || ''}`
  }
)
```

---

## Lesson 5.59 - Make the Project Page Template Dynamic

> **Purpose:** Update project detail page template to display real data and add description field.

### Overview

Replace placeholder content with actual project data and add description field to database schema.

---

### Step 1: Update Database Schema

**Location:** Migration file

#### Tasks

- [ ] Add description column: `description text not null default ''`
- [ ] Update seed.js: `description: faker.lorem.paragraph(2)`
- [ ] Run: `npm run db:reset`, `npm run db:seed`, `npm run supabase:types`

---

### Step 2: Update Template

**File:** `src/pages/projects/[slug].vue`

#### Tasks

- [ ] Display project name: `{{ project.name }}`
- [ ] Display description: `{{ project.description }}`
- [ ] Display status: `{{ project.status }}`
- [ ] Loop over collaborators with Avatar components
- [ ] Loop over tasks in tasks table

---

## Lesson 5.60 - Exercise: Create Dynamic Individual Task Page

> **Purpose:** Create a task detail page similar to the project detail page.

### Overview

Create a task query and detail page that displays task information with related project data.

---

### Step 1: Create Task Query

**File:** `src/utils/supaQueries.ts`

#### Tasks

- [ ] Add task query:

```typescript
export const taskQuery = (id: string) => {
  return supabase
    .from('tasks')
    .select(`
      *,
      projects (
        id,
        name,
        slug
      )
    `)
    .eq('id', id)
    .single()
}

export type Task = QueryData<ReturnType<typeof taskQuery>>
```

---

### Step 2: Create Task Detail Page

**File:** `src/pages/tasks/[id].vue`

#### Tasks

- [ ] Create route: `const route = useRoute('/tasks/[id]')`
- [ ] Create task ref: `const task = ref<Task | null>(null)`
- [ ] Create getTask function:

```typescript
const getTask = async () => {
  const { data, error } = await taskQuery(route.params.id)
  if (error) console.error(error)
  task.value = data
}

await getTask()
```

- [ ] Add watcher for page title:

```typescript
watch(
  () => task.value?.name,
  () => {
    usePageStore().pageData.title = `Task: ${task.value?.name || ''}`
  }
)
```

- [ ] Update template to display task data

---

### Notes / Learnings

- **Auto-Imports:** Reduces boilerplate by automatically importing commonly used functions
- **Suspense:** Provides better UX by showing loading states during async operations
- **Centralized Queries:** Separating queries into utils files improves maintainability and reusability
- **Type Safety:** Using QueryData helper ensures type safety for Supabase query results
- **Nested Queries:** Supabase allows fetching related data in a single query, reducing API calls
- **Dynamic Titles:** Pinia store provides centralized state management for page metadata
