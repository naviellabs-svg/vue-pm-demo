# Frontend: Shadcn UI and Data Tables

## Overview

Patterns for using Shadcn Vue components, TanStack Table, Iconify icons, and building data tables with Vue.js.

## When to Use

- ✅ Building data tables with sorting, filtering, pagination
- ✅ Using Shadcn Vue component library
- ✅ Displaying icons with Iconify
- ✅ Creating reusable table column definitions
- ✅ Building responsive layouts with Tailwind CSS

## Shadcn Vue Setup

### Installation

```bash
# Install Shadcn components as needed
npx shadcn-vue@latest add input
npx shadcn-vue@latest add dropdown-menu
npx shadcn-vue@latest add avatar
npx shadcn-vue@latest add card
npx shadcn-vue@latest add separator
npx shadcn-vue@latest add label
npx shadcn-vue@latest add button
npx shadcn-vue@latest add table
```

### Configuration

**File:** `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Shadcn components are auto-imported via unplugin-vue-components
})
```

## Iconify Setup

### Installation

```bash
npm i iconify-icon
```

### Vite Configuration

**File:** `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (element) => element.startsWith('iconify-icon')
        }
      }
    })
  ]
})
```

### Main Entry

**File:** `main.ts`

```typescript
import "iconify-icon"
```

### Usage

```vue
<template>
  <iconify-icon icon="lucide:search" class="text-muted-foreground" />
</template>
```

## TanStack Table Setup

### Installation

```bash
npm install @tanstack/vue-table
```

### DataTable Component

**File:** `src/components/ui/data-table/DataTable.vue`

```vue
<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef } from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}>()

const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  getCoreRowModel: getCoreRowModel(),
})
</script>

<template>
  <div class="border rounded-md">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
          >
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>

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

## Column Definitions

### Basic Column Pattern

**File:** `src/utils/tableColumns/projectsColumns.ts`

```typescript
import type { ColumnDef } from '@tanstack/vue-table'
import type { Projects } from '@/utils/supaQueries'
import type { Ref } from 'vue'
import type { GroupedCollabs } from '@/types/GroupedCollabs'

export const columns = (collabs: Ref<GroupedCollabs>): ColumnDef<Projects[0]>[] => [
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
  },
  {
    accessorKey: 'status',
    header: () => h('div', { class: 'text-left' }, 'Status'),
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-left font-medium' },
        h(AppInPlaceEditStatus, {
          modelValue: row.original.status,
          readonly: true
        })
      )
    }
  }
]
```

### Using Columns in Component

**File:** `src/pages/projects/index.vue`

```vue
<script setup lang="ts">
import { columns } from '@/utils/tableColumns/projectsColumns'
import { useCollabs } from '@/composables/collabs'

const { getGroupedCollabs, groupedCollabs } = useCollabs()

await getProjects()
getGroupedCollabs(projects.value) // Non-blocking

const columnsWithCollabs = columns(groupedCollabs)
</script>

<template>
  <DataTable v-if="projects" :columns="columnsWithCollabs" :data="projects" />
</template>
```

## Layout Components

### Sidebar Component

**File:** `src/components/layout/Sidebar.vue`

```vue
<script setup lang="ts">
const links = [
  {
    title: 'Dashboard',
    to: '/',
    icon: 'lucide:house'
  },
  {
    title: 'Projects',
    to: '/projects',
    icon: 'lucide:building-2'
  }
]

const accountLinks = [
  {
    title: 'Profile',
    to: '/profile',
    icon: 'lucide:user'
  },
  {
    title: 'Settings',
    to: '/settings',
    icon: 'lucide:settings'
  }
]
</script>

<template>
  <aside class="flex flex-col h-screen gap-2 border-r fixed bg-muted/40 lg:w-52 w-16 transition-[width]">
    <div class="flex h-16 items-center border-b px-2 lg:px-4 shrink-0 gap-1 justify-between">
      <Button variant="outline" size="icon" class="w-8 h-8">
        <iconify-icon icon="lucide:menu"></iconify-icon>
      </Button>
      <Button variant="outline" size="icon" class="w-8 h-8">
        <iconify-icon icon="lucide:plus"></iconify-icon>
      </Button>
    </div>
    <nav class="flex flex-col gap-2 justify-between h-full relative">
      <div>
        <SidebarLinks :links="links" />
      </div>
      <div class="border-y text-center bg-background py-3">
        <SidebarLinks :links="accountLinks" />
      </div>
    </nav>
  </aside>
</template>
```

### SidebarLinks Component

**File:** `src/components/layout/SidebarLinks.vue`

```vue
<script setup lang="ts">
interface LinkProp {
  title: string
  to: string
  icon: string
}

defineProps<{
  links: LinkProp[]
}>()
</script>

<template>
  <RouterLink
    v-for="link in links"
    :key="link.title"
    :to="link.to"
    class="flex items-center gap-3 px-4 py-2 mx-2 transition-colors rounded-lg hover:text-primary justify-center lg:justify-normal text-muted-foreground"
    exact-active-class="text-primary bg-muted"
  >
    <iconify-icon :icon="link.icon"></iconify-icon>
    <span class="hidden lg:block text-nowrap">{{ link.title }}</span>
  </RouterLink>
</template>
```

### AuthLayout Component

**File:** `src/components/layout/main/authLayout.vue`

```vue
<script setup lang="ts">
import Sidebar from '@/components/layout/Sidebar.vue'
import TopNavbar from '@/components/layout/TopNavbar.vue'
import { usePageStore } from '@/stores/page'

const { pageData } = storeToRefs(usePageStore())
</script>

<template>
  <Sidebar />
  <div class="flex flex-col lg:ml-52 ml-16 transition-[margin]">
    <TopNavbar />
    <main class="flex flex-col flex-1 gap-4 p-4 lg:gap-6 lg:p-6">
      <div class="flex items-center">
        <h1 class="text-lg font-semibold md:text-2xl">{{ pageData.title }}</h1>
      </div>
      <slot />
    </main>
  </div>
</template>
```

## Best Practices

1. **Component organization:** Group layout components in `components/layout/`
2. **Column separation:** Extract column definitions to `utils/tableColumns/`
3. **Type safety:** Type all column definitions with `ColumnDef<T>`
4. **Render functions:** Use `h()` for dynamic component rendering in cells
5. **Active links:** Use `exact-active-class` for router link styling
6. **Responsive design:** Use Tailwind responsive classes (lg:, md:)

## Common Gotchas

1. **Table cell padding:** Remove padding from `TableCell`, add to child elements
2. **Render function props:** Use `modelValue` not `v-model` in render functions
3. **Iconify registration:** Must import "iconify-icon" in main.ts
4. **Custom elements:** Configure Vite to recognize iconify-icon as custom element
5. **Column reactivity:** Pass reactive refs to column functions for dynamic updates

## References

- [Shadcn Vue](https://www.shadcn-vue.com/)
- [TanStack Table](https://tanstack.com/table/latest)
- [Iconify](https://icon-sets.iconify.design/)
