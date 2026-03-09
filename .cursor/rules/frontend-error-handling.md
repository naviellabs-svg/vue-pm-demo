# Frontend: Error Handling Patterns

## Overview

Patterns for global error handling in Vue.js applications using Pinia stores, Vue Router navigation guards, and environment-specific error components.

## When to Use

- ✅ Global error state management
- ✅ Handling Supabase errors
- ✅ Handling native JavaScript errors
- ✅ Creating user-friendly error pages
- ✅ Environment-specific error displays

## Error Store Pattern

### Basic Error Store

**File:** `src/stores/error.ts`

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PostgrestError } from '@supabase/supabase-js'
import type { CustomError, ExtendedPostgrestError } from '@/types/Error'

export const useErrorStore = defineStore('error-store', () => {
  const activeError = ref<null | CustomError | ExtendedPostgrestError>(null)
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
      activeError.value.statusCode = customCode || 500
      isCustomError.value = true
      return
    }

    activeError.value = error as ExtendedPostgrestError
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

### Error Types

**File:** `src/types/Error.ts`

```typescript
import type { PostgrestError } from '@supabase/supabase-js'

export interface CustomError extends Error {
  customCode?: number
  statusCode?: number
}

export interface ExtendedPostgrestError extends PostgrestError {
  statusCode?: number
}
```

## Error Page Components

### Development Error Component

**File:** `src/components/AppError/AppErrorDevSection.vue`

```vue
<script setup lang="ts">
defineProps<{
  message: string
  customCode: number
  code: string
  statusCode: number
  hint: string | null
  details: string
}>()
</script>

<template>
  <div class="error__content">
    <iconify-icon icon="lucide:triangle-alert" class="error__icon" />
    <h1 class="error__code">{{ customCode || code }}</h1>
    <p class="error__code" v-if="statusCode">Status Code: {{ statusCode }}</p>
    <p class="error__msg">{{ message }}</p>
    <p v-if="hint">{{ hint }}</p>
    <p v-if="details">{{ details }}</p>
    <div class="error-footer">
      <p class="error-footer__text">You'll find lots to explore on the home page.</p>
      <RouterLink to="/">
        <Button class="max-w-36"> Back to homepage </Button>
      </RouterLink>
    </div>
  </div>
</template>
```

### Production Error Component

**File:** `src/components/AppError/AppErrorProdSection.vue`

```vue
<script setup lang="ts">
const props = defineProps<{
  message: string
  customCode: number
  statusCode: number
  isCustomError: boolean
}>()

const error = ref({
  code: 500,
  msg: 'Oops! Something went wrong.',
})

if (props.isCustomError) {
  error.value.code = props.customCode
  error.value.msg = props.message
}

if (props.statusCode === 406) {
  error.value.code = 404
  error.value.msg = "Sorry, we couldn't find this page."
}
</script>

<template>
  <div class="error__content">
    <iconify-icon icon="lucide:triangle-alert" class="error__icon" />
    <h1 class="error__code">{{ error.code }}</h1>
    <p class="error__msg">{{ error.msg }}</p>
    <div class="error-footer">
      <p class="error-footer__text">You'll find lots to explore on the home page.</p>
      <RouterLink to="/">
        <Button class="max-w-36"> Back to homepage </Button>
      </RouterLink>
    </div>
  </div>
</template>
```

### Main Error Page

**File:** `src/components/AppError/AppErrorPage.vue`

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useErrorStore } from '@/stores/error'

const router = useRouter()
const errorStore = useErrorStore()

// Conditionally load dev or prod component
const ErrorTemplate = import.meta.env.DEV
  ? defineAsyncComponent(() => import('./AppErrorDevSection.vue'))
  : defineAsyncComponent(() => import('./AppErrorProdSection.vue'))

// Extract error data
const error = ref(errorStore.activeError)
const message = ref('')
const customCode = ref(0)
const details = ref('')
const code = ref('')
const hint = ref('')
const statusCode = ref(0)

if (error.value && !('code' in error.value)) {
  message.value = error.value.message
  customCode.value = error.value.customCode ?? 0
}

if (error.value && 'code' in error.value) {
  message.value = error.value.message
  details.value = error.value.details
  hint.value = error.value.hint
  code.value = error.value.code
  statusCode.value = error.value.statusCode ?? 0
}

// Clear error on navigation
router.afterEach(() => {
  errorStore.clearError()
})
</script>

<template>
  <section class="error">
    <ErrorTemplate
      :message
      :customCode
      :details
      :code
      :hint
      :statusCode
      :isCustomError="errorStore.isCustomError"
    />
  </section>
</template>
```

## Error Boundary Pattern

### onErrorCaptured Hook

**File:** `app.vue`

```typescript
import { onErrorCaptured } from 'vue'
import { useErrorStore } from '@/stores/error'

const errorStore = useErrorStore()

onErrorCaptured((error) => {
  errorStore.setError({ error })
})
```

## Using Errors in Components

### Supabase Query Error Handling

```typescript
const getProjects = async () => {
  const { data, error, status } = await projectsQuery

  if (error) {
    useErrorStore().setError({ error, customCode: status })
    return
  }

  projects.value = data
}
```

### Custom Error Handling

```typescript
// In catch-all route
useErrorStore().setError({ 
  error: 'page not found', 
  customCode: 404 
})

// Native JavaScript error
useErrorStore().setError({ 
  error: Error('Something went wrong'), 
  customCode: 500 
})
```

## App Integration

### Conditional Error Display

**File:** `app.vue`

```vue
<template>
  <AuthLayout>
    <AppErrorPage v-if="errorStore.activeError" />
    <RouterView v-else v-slot="{ Component, route }">
      <!-- Normal app content -->
    </RouterView>
  </AuthLayout>
</template>

<script setup lang="ts">
import { onErrorCaptured } from 'vue'
import { useErrorStore } from '@/stores/error'

const errorStore = useErrorStore()

onErrorCaptured((error) => {
  errorStore.setError({ error })
})
</script>
```

## Best Practices

1. **Centralized handling:** Use Pinia store for global error state
2. **Type safety:** Define error interfaces for different error types
3. **Environment-specific:** Show detailed errors in dev, user-friendly in prod
4. **Auto-clear:** Clear errors on route navigation
5. **Error boundaries:** Use `onErrorCaptured` for unhandled errors
6. **Status codes:** Include HTTP status codes for better error context

## Common Gotchas

1. **Error type checking:** Use type guards to distinguish error types
2. **Reactivity:** Access errorStore directly, not destructured, to maintain reactivity
3. **Clear timing:** Clear errors in `afterEach` hook, not `beforeEach`
4. **Async components:** Use `defineAsyncComponent` for code splitting
5. **Error persistence:** Errors persist until explicitly cleared

## References

- [Vue Error Handling](https://vuejs.org/guide/extras/error-handling.html)
- [onErrorCaptured Hook](https://vuejs.org/api/composition-api-lifecycle.html#onerrorcaptured)
