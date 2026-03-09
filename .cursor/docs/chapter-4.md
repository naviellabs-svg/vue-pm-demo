# Chapter 4: Getting Started with Shadcn UI and Vue.js

## Lesson 4.33 - Getting Started with Shadcn UI and Vue.js

> **Purpose:** Set up Shadcn UI for Vue.js with Tailwind CSS 4 integration.

### Overview

Install and configure Shadcn Vue components library following the official installation guide for Vite projects.

---

### Step 1: Install Shadcn Vue

**Location:** Terminal / Web

#### Tasks

- [ ] Go to shadcn for vue: https://www.shadcn-vue.com/
- [ ] Follow docs/getting started/installation/vite
- [ ] Go follow steps on shadcn for tailwind 4: https://www.shadcn-vue.com/docs/installation/vite.html

---

### Step 2: Move Styles

**File:** `src/assets/index.css`

#### Tasks

- [ ] Move `styles.css` to `assets` folder and rename as `index.css`
- [ ] In `main.ts`, import css: `import './assets/index.css'`

---

## Lesson 4.34 - Prepare the Vue App Layout with TailwindCSS

> **Purpose:** Set up the basic app layout with dark mode and navigation bar.

### Overview

Configure the HTML for dark mode and create a navigation bar with search input and avatar dropdown.

---

### Step 1: Configure Dark Mode

**File:** `index.html`

#### Tasks

- [ ] In `<html>` add: `class="dark"`

---

### Step 2: Create Navigation Bar

**File:** `app.vue`

#### Tasks

- [ ] Add `<nav>` before `<main>`:

```vue
<nav class="h-16 border-b bg-muted/40 flex justify-between px-6 items-center">
  <form class="w-full max-w-96">
    <input type="text" placeholder="Search..." class="w-full bg-background pl-8" />
  </form>
  <div class="w-8 h-8 rounded-full bg-white"></div>
</nav>
```

---

## Lesson 4.35 - Utilize Shadcn Input and Dropdown Components

> **Purpose:** Replace basic HTML inputs with Shadcn components and add dropdown menu functionality.

### Overview

Install and use Shadcn Input, DropdownMenu, and Avatar components to create a professional navigation bar.

---

### Step 1: Install Shadcn Components

**Location:** Terminal

#### Tasks

- [ ] `npx shadcn-vue@latest add input`
- [ ] `npx shadcn-vue@latest add dropdown-menu`
- [ ] `npx shadcn-vue@latest add avatar`

---

### Step 2: Update App.vue

**File:** `app.vue`

#### Tasks

- [ ] Import Input component: `import Input from '@/components/ui/input/Input.vue'`
- [ ] Import DropdownMenu components from `@/components/ui/dropdown-menu`
- [ ] Import Avatar components from `@/components/ui/avatar`
- [ ] Replace input with `<Input>` component
- [ ] Add DropdownMenu with Avatar trigger

---

## Lesson 4.36 - Use Lucide Icons with Iconify and Vue.js

> **Purpose:** Set up Iconify for using Lucide icons in the Vue application.

### Overview

Configure Iconify web components to use Lucide icon set for consistent iconography throughout the app.

---

### Step 1: Install Iconify

**Location:** Terminal

#### Tasks

- [ ] Go to iconify: https://icon-sets.iconify.design/
- [ ] Select lucide icon set
- [ ] Install: `npm i iconify-icon`

---

### Step 2: Configure Vite

**File:** `vite.config.ts`

#### Tasks

- [ ] In `main.ts`, add: `import "iconify-icon";`
- [ ] In `vite.config.ts`, inside the vue plugin, add:

```typescript
{
  template: {
    compilerOptions: {
      isCustomElement: (element) => element.startsWith('iconify-icon')
    }
  }
}
```

---

### Step 3: Use Icons in App

**File:** `app.vue`

#### Tasks

- [ ] Replace SVG with: `<iconify-icon icon="lucide:search"></iconify-icon>`
- [ ] Update CSS for icon positioning:

```vue
<nav class="h-16 border-b bg-muted/40 flex justify-between px-6 items-center">
  <form class="relative w-full h-fit max-w-96">
    <iconify-icon class="absolute top-[50%] translate-y-[-50%] left-2.5 text-muted-foreground" icon="lucide:search"></iconify-icon>
    <Input class="w-full pl-8 bg-background" type="text" placeholder="Search ..." />
  </form>
</nav>
```

- [ ] Install VS Code extension: Iconify IntelliSense

---

## Lesson 4.38 - Create a Sidebar and Organize Code with Vue Components

> **Purpose:** Extract sidebar and navigation components for better code organization.

### Overview

Create reusable layout components (Sidebar, TopNavbar) and organize the app structure with proper component separation.

---

### Step 1: Create Sidebar Component

**File:** `src/components/layout/Sidebar.vue`

#### Tasks

- [ ] Create new file `Sidebar.vue`
- [ ] Copy sidebar `<aside>` code from app.vue
- [ ] Add navigation links with RouterLink and Iconify icons

---

### Step 2: Create TopNavbar Component

**File:** `src/components/layout/TopNavbar.vue`

#### Tasks

- [ ] Create new file `TopNavbar.vue`
- [ ] Copy navigation bar code from app.vue
- [ ] Import necessary components (Input, DropdownMenu, Avatar)

---

### Step 3: Update App.vue

**File:** `app.vue`

#### Tasks

- [ ] Import Sidebar and TopNavbar components
- [ ] Replace inline code with component usage
- [ ] Structure layout properly with sidebar and main content area

---

## Lesson 4.39 - Extract a Reusable Vue Component for Sidebar Links

> **Purpose:** Create a reusable component for sidebar navigation links to reduce code duplication.

### Overview

Extract the RouterLink pattern into a reusable SidebarLinks component that accepts an array of link objects.

---

### Step 1: Create SidebarLinks Component

**File:** `src/components/layout/SidebarLinks.vue`

#### Tasks

- [ ] Create new file `SidebarLinks.vue`
- [ ] Define props interface:

```typescript
interface LinkProp {
  title: string
  to: string
  icon: string
}

defineProps<{
  links: LinkProp[]
}>()
```

- [ ] Use `v-for` to render links dynamically

---

### Step 2: Update Sidebar Component

**File:** `src/components/layout/Sidebar.vue`

#### Tasks

- [ ] Create `links` array with navigation items
- [ ] Create `accountLinks` array for account-related links
- [ ] Use `<SidebarLinks :links="links" />` component

---

## Lesson 4.40 - Configure Vue Router Active Links with TailwindCSS

> **Purpose:** Add visual feedback for active navigation links using Vue Router's active link classes.

### Overview

Configure RouterLink to apply TailwindCSS classes when the link matches the current route.

---

### Step 1: Add Active Link Classes

**File:** `src/components/layout/SidebarLinks.vue`

#### Tasks

- [ ] Add to RouterLink: `exactActiveClass="text-primary bg-muted"`

---

## Lesson 4.41 - Create Layout Vue.js Component

> **Purpose:** Create a reusable AuthLayout component that wraps authenticated pages with sidebar and navbar.

### Overview

Extract the layout structure into a reusable component that can be used across authenticated pages.

---

### Step 1: Install Button Component

**Location:** Terminal

#### Tasks

- [ ] `npx shadcn-vue@latest add button`

---

### Step 2: Create AuthLayout Component

**File:** `src/components/layout/main/authLayout.vue`

#### Tasks

- [ ] Create new file `authLayout.vue`
- [ ] Copy all app.vue content
- [ ] Change `<RouterView />` to `<slot />`
- [ ] Import Sidebar and TopNavbar components

---

### Step 3: Update App.vue

**File:** `app.vue`

#### Tasks

- [ ] Import AuthLayout: `import AuthLayout from './components/layout/main/authLayout.vue'`
- [ ] Update template:

```vue
<template>
  <AuthLayout>
    <RouterView />
  </AuthLayout>
</template>
```

---

## Lesson 4.42 - Build a Vue.js Data Table Component with Shadcn and TanStack

> **Purpose:** Set up TanStack Table with Shadcn table components for displaying data in tables.

### Overview

Install and configure TanStack Vue Table with Shadcn table components to create a reusable data table.

---

### Step 1: Install Dependencies

**Location:** Terminal

#### Tasks

- [ ] Install TanStack Table: `npm install @tanstack/vue-table`
- [ ] Install Shadcn table: `npx shadcn-vue@latest add table`

---

### Step 2: Create DataTable Component

**File:** `src/components/ui/data-table/DataTable.vue`

#### Tasks

- [ ] Create new file `DataTable.vue`
- [ ] Copy DataTable code from Shadcn docs
- [ ] Set up generic types for data and columns

---

### Step 3: Set Up Columns

**File:** `src/pages/tasks/index.vue`

#### Tasks

- [ ] Import `ColumnDef` from `@tanstack/vue-table`
- [ ] Import `h` from vue
- [ ] Define columns array with column definitions
- [ ] Use DataTable component with columns and data props

---

## Lesson 4.43 - Customize the Data Table Implementation for Our Vue.js App

> **Purpose:** Replace example data with actual task data from Supabase and customize columns.

### Overview

Connect the data table to real Supabase data and customize column definitions for tasks.

---

### Step 1: Update Tasks Page

**File:** `src/pages/tasks/index.vue`

#### Tasks

- [ ] Remove example Payment interface and data
- [ ] Update columns to use `Tables<'tasks'>` type
- [ ] Change column definitions to match task properties (name, status, due_date, collaborators)
- [ ] Update template to use tasks data: `<DataTable v-if="tasks" :columns="columns" :data="tasks" />`

---

## Lesson 4.44 - Create a Data Table for the Projects Page

> **Purpose:** Create a similar data table for the projects page with project-specific columns.

### Overview

Reuse the DataTable component pattern for displaying projects with appropriate column definitions.

---

### Step 1: Define Projects Columns

**File:** `src/pages/projects/index.vue`

#### Tasks

- [ ] Define columns array for projects:

```typescript
const columns: ColumnDef<Tables<'projects'>>[] = [
  {
    accessorKey: 'name',
    header: () => h('div', { class: 'text-left' }, 'Name'),
    cell: ({ row }) => {
      return h('div', { class: 'text-left font-medium' }, row.getValue('name'))
    }
  },
  {
    accessorKey: 'status',
    header: () => h('div', { class: 'text-left' }, 'Status'),
    cell: ({ row }) => {
      return h('div', { class: 'text-left font-medium' }, row.getValue('status'))
    }
  },
  {
    accessorKey: 'collaborators',
    header: () => h('div', { class: 'text-left' }, 'Collaborators'),
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-left font-medium' },
        JSON.stringify(row.getValue('collaborators'))
      )
    }
  }
]
```

- [ ] Update template: `<DataTable v-if="projects" :columns="columns" :data="projects" />`

---

## Lesson 4.45 - Make the Data Table Cells Clickable with RouterLink

> **Purpose:** Convert table cells into clickable links that navigate to detail pages.

### Overview

Use Vue render functions to create RouterLink components in table cells for navigation.

---

### Step 1: Update Projects Columns

**File:** `src/pages/projects/index.vue`

#### Tasks

- [ ] Change name column cell to RouterLink:

```typescript
{
  accessorKey: 'name',
  header: () => h('div', { class: 'text-left' }, 'Name'),
  cell: ({ row }) => {
    return h(
      RouterLink,
      {
        to: `/projects/${row.original.slug}`,
        class: 'text-left font-medium hover:bg-muted block w-full'
      },
      () => row.getValue('name')
    )
  }
}
```

---

### Step 2: Update Project Detail Route

**File:** `src/pages/projects/[slug].vue`

#### Tasks

- [ ] Rename `[id].vue` to `[slug].vue`
- [ ] Update route params to use `slug` instead of `id`
- [ ] Update template: `<h1>Projects {{ route.params?.slug }}</h1>`

---

### Step 3: Fix Table Cell Padding

**File:** `src/components/ui/data-table/DataTable.vue`

#### Tasks

- [ ] Add scoped styles:

```vue
<style scoped>
@reference "@/assets/index.css";

td {
  @apply p-0;
}

td > * {
  @apply p-4;
}
</style>
```

---

### Notes / Learnings

- **Render Functions:** Use `h()` function to create RouterLink components programmatically in table cells
- **Type Safety:** TanStack Table provides type-safe column definitions with TypeScript
- **Reusability:** DataTable component can be reused across different pages with different column definitions
- **Styling:** Remove default padding from table cells and apply padding to child elements for better control
