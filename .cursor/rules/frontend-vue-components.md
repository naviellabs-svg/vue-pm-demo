# Frontend: Vue Component Patterns

## Overview

Patterns for creating reusable Vue components, using `defineModel`, render functions, props destructuring, and component composition patterns.

## When to Use

- ✅ Creating reusable form components
- ✅ Building in-place editing components
- ✅ Using Vue 3.3+ `defineModel` macro
- ✅ Creating components with render functions
- ✅ Implementing two-way data binding

## defineModel Pattern

### Basic Usage

Vue 3.3+ introduces `defineModel` for simplified two-way data binding:

**File:** `src/components/AppInPlaceEdit/AppInPlaceEditText.vue`

```vue
<script setup lang="ts">
const value = defineModel<string>()

defineEmits(['commit'])
</script>

<template>
  <input
    v-model="value"
    class="w-full p-1 bg-transparent focus:outline-none focus:border-none focus:bg-gray-800 focus:rounded-md"
    type="text"
    @blur="$emit('commit')"
    @keypress.enter="($event.target as HTMLInputElement).blur()"
  />
</template>
```

### Usage in Parent

```vue
<template>
  <AppInPlaceEditText 
    v-model="project.name" 
    @commit="updateProject" 
  />
</template>
```

### What defineModel Does

`defineModel()` automatically creates:
- `modelValue` prop
- `update:modelValue` emit
- Reactive computed property

Equivalent to:

```typescript
const props = defineProps<{ modelValue: string }>()
const emits = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const value = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})
```

## Props Destructuring with Defaults

### Pattern

Use destructuring to assign default values to props:

**File:** `src/components/AppInPlaceEdit/AppInPlaceEditStatus.vue`

```vue
<script setup lang="ts">
const value = defineModel<'in-progress' | 'completed'>()

const emit = defineEmits(['commit'])

// Props destructuring with default value
const { readonly = false } = defineProps<{
  readonly?: boolean
}>()

const toggleValue = () => {
  if (readonly) return
  
  value.value = value.value === 'completed' ? 'in-progress' : 'completed'
  emit('commit')
}
</script>

<template>
  <div class="text-2xl cursor-pointer" @click="toggleValue">
    <iconify-icon 
      v-if="value === 'completed'" 
      icon="lucide:circle-check" 
      class="text-green-500" 
    />
    <iconify-icon 
      v-else 
      icon="lucide:circle-dot" 
      class="text-gray-500" 
    />
  </div>
</template>
```

### Benefits

- Cleaner syntax than `props.readonly`
- Default value assignment in one line
- TypeScript infers type automatically

## Render Functions

### When to Use

Use render functions (`h()`) when:
- Working with libraries that expect render functions (TanStack Table)
- Creating dynamic component generation
- Programmatic component creation

### Basic Render Function

```typescript
import { h } from 'vue'

// Simple element
h('div', { class: 'container' }, 'Hello')

// Component with props
h(Avatar, { class: 'border' }, () => 
  h(AvatarImage, { src: 'url' })
)

// Multiple children
h('div', {}, [
  h('span', {}, 'First'),
  h('span', {}, 'Second')
])
```

### Render Function in Table Columns

**File:** `src/utils/tableColumns/projectsColumns.ts`

```typescript
import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import RouterLink from 'vue-router'
import AppInPlaceEditStatus from '@/components/AppInPlaceEdit/AppInPlaceEditStatus.vue'

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

### Render Function Syntax

```typescript
h(Component, Props, Children)
```

- **Component:** Vue component or HTML tag name
- **Props:** Object with component props/attributes
- **Children:** String, array of VNodes, or function returning VNodes

## Component Composition

### Reusable Link Component

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

### Usage

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
</script>

<template>
  <SidebarLinks :links="links" />
</template>
```

## Component Events

### Commit Pattern

Emit events when user finishes editing:

```vue
<script setup lang="ts">
const value = defineModel<string>()

const emit = defineEmits(['commit'])

// Emit on blur or Enter key
const handleBlur = () => {
  emit('commit')
}

const handleEnter = (event: KeyboardEvent) => {
  (event.target as HTMLInputElement).blur()
}
</script>

<template>
  <input
    v-model="value"
    @blur="handleBlur"
    @keypress.enter="handleEnter"
  />
</template>
```

### Parent Handler

```vue
<template>
  <AppInPlaceEditText 
    v-model="project.name" 
    @commit="updateProject" 
  />
</template>

<script setup lang="ts">
const updateProject = async () => {
  // Save to database
  await saveProject(project.value)
}
</script>
```

## Conditional Rendering

### Status Component Pattern

```vue
<template>
  <div class="text-2xl cursor-pointer" @click="toggleValue">
    <Transition mode="out-in">
      <iconify-icon
        v-if="value === 'completed'"
        icon="lucide:circle-check"
        class="text-green-500"
        key="completed"
      />
      <iconify-icon 
        v-else 
        icon="lucide:circle-dot" 
        class="text-gray-500" 
        key="in-progress" 
      />
    </Transition>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: transform 0.1s;
}

.v-enter-from,
.v-leave-to {
  transform: scale(0.3);
}
</style>
```

## Best Practices

1. **Use `defineModel`** for two-way binding components (Vue 3.3+)
2. **Props destructuring** for cleaner code with defaults
3. **Render functions** for dynamic component generation
4. **Emit commit events** for save operations, not on every keystroke
5. **Type safety** - always type props and emits
6. **Component composition** - break down complex components
7. **Readonly props** - use when component should be display-only

## Common Gotchas

1. **defineModel type:** Always specify type parameter `defineModel<string>()`
2. **Render functions:** Must use `modelValue` prop, not `v-model` in `h()`
3. **Children as functions:** Use arrow function when child needs props
4. **Transition keys:** Required for transitions to work correctly
5. **Props casing:** Vue props are case-sensitive (`modelValue` not `modelvalue`)

## References

- [Vue 3 defineModel](https://vuejs.org/api/sfc-script-setup.html#definemodel)
- [Render Functions](https://vuejs.org/guide/extras/render-function.html)
- [Component Props](https://vuejs.org/guide/components/props.html)
