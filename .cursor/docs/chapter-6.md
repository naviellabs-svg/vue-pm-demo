# Chapter 6: Error Handling

## Lesson 6.61 - Intro: Why Error Handling Matters for Developers and Users

> **Purpose:** Create a 404 error page for handling unmatched routes.

### Overview

Set up a catch-all route that displays a user-friendly error page when users navigate to non-existent routes.

---

### Step 1: Create Catch-All Route

**File:** `src/pages/[...catchAll].vue`

#### Tasks

- [ ] Create error page template:

```vue
<template>
  <section class="error">
    <div class="error__content">
      <iconify-icon icon="lucide:triangle-alert" class="error__icon" />
      <h1 class="error__code">404</h1>
      <p class="error__msg">Page not found</p>
      <div class="error-footer">
        <p class="error-footer__text">You'll find lots to explore on the home page.</p>
        <RouterLink to="/">
          <Button class="max-w-36"> Back to homepage </Button>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
@reference "@/assets/index.css";

.error {
  @apply mx-auto flex justify-center items-center flex-1 p-10 text-center -mt-20 min-h-[90vh];
}

.error__content {
  @apply flex flex-col items-center justify-center w-full;
}

.error__icon {
  @apply text-7xl text-destructive;
}

.error__code {
  @apply font-extrabold text-7xl text-secondary;
}

.error__msg {
  @apply text-3xl font-extrabold text-primary;
}

.error-footer {
  @apply flex flex-col items-center justify-center gap-5 mt-6 font-light;
}

.error-footer__text {
  @apply text-lg text-muted-foreground;
}

p {
  @apply my-2;
}
</style>
```

---

### Step 2: Create Error Component

**File:** `src/components/AppError/AppErrorPage.vue`

#### Tasks

- [ ] Copy template and styles from catchAll to AppErrorPage component

---

## Lesson 6.62 - Create Global Error Handler in Vue.js with Pinia and Vue Router

> **Purpose:** Create a centralized error store to manage application-wide errors.

### Overview

Set up a Pinia store to track errors globally and display error pages when errors occur.

---

### Step 1: Create Error Store

**File:** `src/stores/error.ts`

#### Tasks

- [ ] Create store:

```typescript
export const useErrorStore = defineStore('error-store', () => {
  const activeError = ref(false)

  const setError = () => {
    activeError.value = true
  }

  return {
    activeError,
    setError,
  }
})
```

---

### Step 2: Update Catch-All Route

**File:** `src/pages/[...catchAll].vue`

#### Tasks

- [ ] Call error store: `useErrorStore().setError()`

---

### Step 3: Update App.vue

**File:** `app.vue`

#### Tasks

- [ ] Use error store:

```typescript
const { activeError } = storeToRefs(useErrorStore())
```

- [ ] Conditionally render error page:

```vue
<template>
  <AuthLayout>
    <AppErrorPage v-if="activeError" />
    <RouterView v-else v-slot="{ Component, route }">
      <!-- ... -->
    </RouterView>
  </AuthLayout>
</template>
```

---

### Step 4: Clear Error on Navigation

**File:** `src/components/AppError/AppErrorPage.vue`

#### Tasks

- [ ] Add router afterEach hook:

```typescript
const router = useRouter()

router.afterEach(() => {
  useErrorStore().activeError = false
})
```

---

## Lesson 6.63 - Adjust the Error Page for Custom Errors

> **Purpose:** Enhance error store to handle custom error messages and codes.

### Overview

Update the error store to accept custom error messages and status codes for different error scenarios.

---

### Step 1: Create Custom Error Type

**File:** `src/types/Error.ts`

#### Tasks

- [ ] Create interface:

```typescript
export interface CustomError extends Error {
  customCode?: number
}
```

---

### Step 2: Update Error Store

**File:** `src/stores/error.ts`

#### Tasks

- [ ] Update store:

```typescript
import type { CustomError } from '@/types/Error'

export const useErrorStore = defineStore('error-store', () => {
  const activeError = ref<null | CustomError>(null)

  const setError = ({ error, customCode }: { error: string; customCode: number }) => {
    activeError.value = Error(error) as CustomError
    activeError.value.customCode = customCode
  }

  return {
    activeError,
    setError
  }
})
```

---

### Step 3: Update Error Page

**File:** `src/components/AppError/AppErrorPage.vue`

#### Tasks

- [ ] Extract error data:

```typescript
const errorStore = useErrorStore()
const error = ref(errorStore.activeError)
const message = ref('')
const customCode = ref(0)

if (error.value) {
  message.value = error.value.message
  customCode.value = error.value.customCode ?? 0
}
```

- [ ] Update template to use dynamic values

---

## Lesson 6.64 - Adjust the Error Page for Supabase Errors

> **Purpose:** Handle Supabase PostgrestError objects in the error store.

### Overview

Extend error handling to support Supabase error objects with detailed error information.

---

### Step 1: Update Error Types

**File:** `src/types/Error.ts`

#### Tasks

- [ ] Add ExtendedPostgrestError interface:

```typescript
export interface ExtendedPostgrestError extends PostgrestError {
  statusCode?: number
}
```

---

### Step 2: Update Error Store

**File:** `src/stores/error.ts`

#### Tasks

- [ ] Update setError to handle PostgrestError:

```typescript
const setError = ({ error, customCode }: { error: string | PostgrestError; customCode: number }) => {
  if (typeof error === 'string') {
    activeError.value = Error(error) as CustomError
    activeError.value.customCode = customCode
    return
  }

  activeError.value = error as ExtendedPostgrestError
}
```

- [ ] Update activeError type: `const activeError = ref<null | CustomError | ExtendedPostgrestError>(null)`

---

### Step 3: Update Error Page

**File:** `src/components/AppError/AppErrorPage.vue`

#### Tasks

- [ ] Add error detail refs:

```typescript
const details = ref('')
const code = ref('')
const hint = ref('')
const statusCode = ref(0)
```

- [ ] Handle PostgrestError:

```typescript
if (error.value && 'code' in error.value) {
  message.value = error.value.message
  details.value = error.value.details
  hint.value = error.value.hint
  code.value = error.value.code
  statusCode.value = error.value.statusCode ?? 0
}
```

- [ ] Update template to display error details

---

### Step 4: Update Components

**Files:** All pages with Supabase queries

#### Tasks

- [ ] Update error handling:

```typescript
const { data, error, status } = await query

if (error) useErrorStore().setError({ error, customCode: status })
```

---

## Lesson 6.65 - Adjust the Error Page for Native JavaScript Errors

> **Purpose:** Handle native JavaScript Error objects in addition to Supabase errors.

### Overview

Extend error handling to support standard JavaScript Error objects for comprehensive error coverage.

---

### Step 1: Update Error Store

**File:** `src/stores/error.ts`

#### Tasks

- [ ] Update setError signature:

```typescript
const setError = ({ error, customCode }: { error: string | PostgrestError | Error; customCode?: number }) => {
  if (typeof error === 'string' || error instanceof Error) {
    activeError.value = typeof error === 'string' ? Error(error) : error
    activeError.value.customCode = customCode || 500
    activeError.value.statusCode = customCode || 500
    return
  }

  activeError.value = error as ExtendedPostgrestError
}
```

---

## Lesson 6.66 - Handle Uncaught JavaScript Errors in Vue.js with onErrorCaptured Hook

> **Purpose:** Catch unhandled errors using Vue's error boundary feature.

### Overview

Use Vue's `onErrorCaptured` lifecycle hook to catch errors that occur in child components.

---

### Step 1: Add Error Boundary

**File:** `app.vue`

#### Tasks

- [ ] Add onErrorCaptured:

```typescript
const errorStore = useErrorStore()

onErrorCaptured((error) => {
  errorStore.setError({ error })
})
```

- [ ] Update template to use errorStore directly:

```vue
<AppErrorPage v-if="errorStore.activeError" />
```

---

## Lesson 6.67 - Use Props and Vue.js Deep Pseudo-class to Create a Dev Error Component

> **Purpose:** Create a development-specific error component with detailed error information.

### Overview

Extract error display logic into a separate component for development environments with full error details.

---

### Step 1: Create Dev Error Component

**File:** `src/components/AppError/AppErrorDevSection.vue`

#### Tasks

- [ ] Create component with props:

```typescript
defineProps<{
  message: string
  customCode: number
  code: string
  statusCode: number
  hint: string | null
  details: string
}>()
```

- [ ] Copy error display template from AppErrorPage

---

### Step 2: Update AppErrorPage

**File:** `src/components/AppError/AppErrorPage.vue`

#### Tasks

- [ ] Use AppErrorDevSection component:

```vue
<section class="error">
  <AppErrorDevSection
    :message
    :customCode
    :details
    :code
    :hint
    :statusCode
  />
</section>
```

---

## Lesson 6.68 - Create an Error Page for the Production Server

> **Purpose:** Create a simplified error page for production that doesn't expose sensitive error details.

### Overview

Create a production error component that shows user-friendly messages without exposing technical details.

---

### Step 1: Create Production Error Component

**File:** `src/components/AppError/AppErrorProdSection.vue`

#### Tasks

- [ ] Create simplified component:

```typescript
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
```

- [ ] Create simplified template with only essential information

---

### Step 2: Update Error Store

**File:** `src/stores/error.ts`

#### Tasks

- [ ] Add isCustomError flag:

```typescript
const isCustomError = ref(false)

const setError = ({ error, customCode }: { error: string | PostgrestError | Error; customCode?: number }) => {
  if (typeof error === 'string') {
    isCustomError.value = true
    // ... rest of logic
  }
  // ...
}

return {
  activeError,
  setError,
  isCustomError
}
```

---

## Lesson 6.69 - Use defineAsyncComponent to Conditionally Render the Appropriate Error Page

> **Purpose:** Conditionally load dev or production error components based on environment.

### Overview

Use Vue's `defineAsyncComponent` to dynamically load the appropriate error component based on the build environment.

---

### Step 1: Update AppErrorPage

**File:** `src/components/AppError/AppErrorPage.vue`

#### Tasks

- [ ] Add conditional component loading:

```typescript
const ErrorTemplate = import.meta.env.DEV
  ? defineAsyncComponent(() => import('./AppErrorDevSection.vue'))
  : defineAsyncComponent(() => import('./AppErrorProdSection.vue'))
```

- [ ] Update template:

```vue
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
```

---

### Step 2: Add Clear Error Function

**File:** `src/stores/error.ts`

#### Tasks

- [ ] Add clearError function:

```typescript
const clearError = () => {
  activeError.value = null
  isCustomError.value = false
}

return {
  activeError,
  setError,
  isCustomError,
  clearError
}
```

---

### Step 3: Update Error Page

**File:** `src/components/AppError/AppErrorPage.vue`

#### Tasks

- [ ] Update afterEach hook:

```typescript
router.afterEach(() => {
  errorStore.clearError()
})
```

---

### Notes / Learnings

- **Error Boundaries:** Use `onErrorCaptured` to catch errors in child components
- **Error Types:** Handle different error types (string, Error, PostgrestError) with type guards
- **Environment-Specific UI:** Use `defineAsyncComponent` to load different components for dev/prod
- **User Experience:** Show detailed errors in development, simplified messages in production
- **Error Clearing:** Automatically clear errors on route navigation to prevent stale error states
- **Centralized Management:** Pinia store provides single source of truth for error state
