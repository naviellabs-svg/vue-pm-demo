# Chapter 7: Authentication with Supabase

## Lesson 7.70 - Set Up Vue.js and Supabase for Seamless Auth Integration

> **Purpose:** Set up authentication infrastructure with Supabase, including profiles table and auth pages.

### Overview

Create the database schema for user profiles, set up login and register pages, and configure Supabase authentication.

---

### Step 1: Create Profiles Migration

**Location:** Terminal

#### Tasks

- [ ] Run: `npm run db:migrate:new profiles-schema`
- [ ] Add migration SQL:

```sql
drop table if exists profiles;
TRUNCATE auth.users cascade;

create table profiles (
  id uuid references auth.users on delete cascade not null,
  created_at timestamptz default now() not null,
  username text unique not null,
  full_name text not null,
  bio text default null,
  mode text default 'dark' not null,
  avatar_url text default null,
  primary key (id)
);
```

- [ ] Run: `npm run db:reset`
- [ ] Run: `npx supabase login`
- [ ] Run: `npm run supabase:types`

---

### Step 2: Create Auth Pages

**Files:** `src/pages/register.vue`, `src/pages/login.vue`

#### Tasks

- [ ] Create register.vue with form template (username, first_name, last_name, email, password, confirm_password)
- [ ] Create login.vue with form template (email, password)
- [ ] Install Shadcn components: `npx shadcn-vue@latest add card separator label`
- [ ] Test pages: `npm run dev`

---

## Lesson 7.71 - Use v-model to Collect Form Data Values

> **Purpose:** Bind form inputs to reactive data using v-model.

### Overview

Create reactive form data objects and bind them to input fields using v-model for two-way data binding.

---

### Step 1: Create Form Data

**File:** `src/pages/register.vue`

#### Tasks

- [ ] Create formData ref:

```typescript
const formData = ref({
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirm_password: '',
})
```

- [ ] Add v-model to all inputs: `v-model="formData.username"`, etc.

---

### Step 2: Create Form Data for Login

**File:** `src/pages/login.vue`

#### Tasks

- [ ] Create formData ref:

```typescript
const formData = ref({
  email: '',
  password: '',
})
```

- [ ] Add v-model to inputs

---

## Lesson 7.72 - Register new Users with Supabase Auth and Vue.js

> **Purpose:** Implement user registration with Supabase authentication.

### Overview

Create a signup function that registers users with Supabase Auth and handles errors appropriately.

---

### Step 1: Configure Supabase

**Location:** Supabase Dashboard

#### Tasks

- [ ] Go to Authentication > Providers
- [ ] Turn off email confirmation (for development)

---

### Step 2: Implement Signup

**File:** `src/pages/register.vue`

#### Tasks

- [ ] Create signup function:

```typescript
const signup = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password
  })

  if (error) return console.log(error)

  console.log(data)
}
```

- [ ] Add form submit handler: `@submit.prevent="signup"`

---

## Lesson 7.73 - Automatically Generate User Profiles on Registration

> **Purpose:** Create a user profile automatically when a user registers.

### Overview

After successful user registration, insert a profile record into the profiles table with user information.

---

### Step 1: Update Signup Function

**File:** `src/pages/register.vue`

#### Tasks

- [ ] Add profile creation:

```typescript
const router = useRouter()

const signup = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password
  })

  if (error) return console.log(error)

  if (data.user) {
    const { error } = await supabase.from('profiles').insert({
      id: data.user.id,
      username: formData.value.username,
      full_name: formData.value.first_name.concat(' ', formData.value.last_name)
    })

    if (error) return console.log('profiles err: ', error)
  }

  router.push('/')
}
```

---

## Lesson 7.74 - Login Users with Supabase Auth and Vue.js

> **Purpose:** Implement user login functionality with Supabase authentication.

### Overview

Create a signin function that authenticates users with Supabase and redirects them to the homepage.

---

### Step 1: Implement Signin

**File:** `src/pages/login.vue`

#### Tasks

- [ ] Create signin function:

```typescript
const router = useRouter()

const signin = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password
  })

  if (error) return console.log(error)

  router.push('/')
}
```

- [ ] Add form submit handler: `@submit.prevent="signin"`

---

## Lesson 7.75 - Quick Cleanup for the Login and Register Pages

> **Purpose:** Extract authentication logic into reusable utility functions.

### Overview

Move authentication functions to a centralized `supaAuth.ts` file and create TypeScript interfaces for form data.

---

### Step 1: Create Auth Types

**File:** `src/types/AuthForm.ts`

#### Tasks

- [ ] Create interfaces:

```typescript
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm extends LoginForm {
  confirmPassword: string
  username: string
  firstName: string
  lastName: string
}
```

---

### Step 2: Create Auth Utilities

**File:** `src/utils/supaAuth.ts`

#### Tasks

- [ ] Create register function:

```typescript
import { supabase } from '@/lib/supabaseClient'
import type { RegisterForm } from '@/types/AuthForm'

export const register = async (formData: RegisterForm) => {
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password
  })

  if (error) return console.log(error)

  if (data.user) {
    const { error } = await supabase.from('profiles').insert({
      id: data.user.id,
      username: formData.username,
      full_name: formData.firstName.concat(' ', formData.lastName)
    })

    if (error) return console.log('profiles err: ', error)
  }

  return true
}
```

- [ ] Create login function:

```typescript
import type { LoginForm } from '@/types/AuthForm'

export const login = async (formData: LoginForm) => {
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password
  })

  if (error) return console.log(error)

  return true
}
```

---

### Step 3: Update Pages

**Files:** `src/pages/register.vue`, `src/pages/login.vue`

#### Tasks

- [ ] Update register.vue:

```typescript
import { register } from '@/utils/supaAuth'

const formData = ref({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const signup = async () => {
  const isRegistered = await register(formData.value)
  if (isRegistered) router.push('/')
}
```

- [ ] Update login.vue similarly with login function

---

## Lesson 7.76-7.87 - Additional Authentication Features

> **Purpose:** Implement additional authentication features including auth state management, route protection, and user profile management.

### Overview

Set up Pinia store for authentication state, create navigation guards, and implement logout functionality.

---

### Step 1: Create Auth Store

**File:** `src/stores/auth.ts`

#### Tasks

- [ ] Create auth store with user and profile state
- [ ] Add functions: `setAuth`, `getSession`, `trackAuthChanges`
- [ ] Use `supabase.auth.onAuthStateChange` to track authentication state

---

### Step 2: Protect Routes

**File:** `src/router/index.ts`

#### Tasks

- [ ] Add navigation guard:

```typescript
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  await authStore.getSession()
  const isAuthPage = ['/login', '/register'].includes(to.path)

  if (!authStore.user && !isAuthPage) {
    return {
      name: '/login',
    }
  }

  if (authStore.user && isAuthPage) {
    return {
      name: '/',
    }
  }
})
```

---

### Step 3: Update Sidebar

**File:** `src/components/layout/Sidebar.vue`

#### Tasks

- [ ] Add logout functionality:

```typescript
const executeAction = async (linkTitle: string) => {
  if (linkTitle === 'Sign out') {
    const { logout } = await import('@/utils/supaAuth')
    const isLoggedOut = await logout()
    if (isLoggedOut) router.push('login')
  }
}
```

---

### Step 4: Create Logout Function

**File:** `src/utils/supaAuth.ts`

#### Tasks

- [ ] Add logout function:

```typescript
export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) return console.log(error)
  return true
}
```

---

### Notes / Learnings

- **Form Binding:** Use v-model for two-way data binding with form inputs
- **Auth Flow:** Supabase handles authentication, but you need to create profiles separately
- **Route Protection:** Use navigation guards to protect authenticated routes
- **State Management:** Pinia store provides centralized auth state management
- **Auth State Changes:** Use `onAuthStateChange` to reactively update auth state
- **Type Safety:** TypeScript interfaces ensure form data structure consistency
- **Code Organization:** Extract auth logic into utility functions for reusability
