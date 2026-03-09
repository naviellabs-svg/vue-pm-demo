# Frontend: Authentication Patterns

## Overview

Patterns for implementing authentication with Supabase Auth, including user registration, login, profile management, and route protection.

## When to Use

- ✅ User authentication and authorization
- ✅ Protected routes
- ✅ User profile management
- ✅ Session management
- ✅ Auth state tracking

## Supabase Auth Setup

### Profiles Table Schema

**Migration:** `supabase/migrations/YYYYMMDDHHMMSS_profiles-schema.sql`

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

## Auth Types

### Form Interfaces

**File:** `src/types/AuthForm.ts`

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

## Auth Utilities

### Registration Function

**File:** `src/utils/supaAuth.ts`

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

### Login Function

**File:** `src/utils/supaAuth.ts`

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

### Logout Function

**File:** `src/utils/supaAuth.ts`

```typescript
export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) return console.log(error)
  return true
}
```

## Auth Store

### Store Setup

**File:** `src/stores/auth.ts`

```typescript
import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'
import { profileQuery } from '@/utils/supaQueries'
import { supabase } from '@/lib/supabaseClient'
import type { Tables } from '@/database/types'

export const useAuthStore = defineStore('auth-store', () => {
  const user = ref<Tables<'profiles'> | null>(null)
  const profile = ref<Tables<'profiles'> | null>(null)
  const isTrackingAuthChanges = ref(false)

  const setAuth = async (session: Session | null) => {
    if (!session?.user) {
      user.value = null
      profile.value = null
      return
    }

    user.value = session.user

    const { data } = await profileQuery({ column: 'id', value: user.value.id })
    profile.value = data
  }

  const getSession = async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session?.user) await setAuth(data.session)
  }

  const trackAuthChanges = () => {
    if (isTrackingAuthChanges.value) return

    isTrackingAuthChanges.value = true
    supabase.auth.onAuthStateChange((event, session) => {
      setTimeout(async () => {
        await setAuth(session)
      }, 0)
    })
  }

  return {
    user,
    profile,
    setAuth,
    getSession,
    trackAuthChanges
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
```

## Registration Page

### Component Pattern

**File:** `src/pages/register.vue`

```vue
<script setup lang="ts">
import { register } from '@/utils/supaAuth'

const formData = ref({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const router = useRouter()

const signup = async () => {
  const isRegistered = await register(formData.value)
  if (isRegistered) router.push('/')
}
</script>

<template>
  <div class="mx-auto w-full flex justify-center items-center p-10 text-center -mt-10 min-h-[90vh] h-full">
    <Card class="max-w-sm w-full mx-auto h-full">
      <CardHeader>
        <CardTitle class="text-2xl"> Register </CardTitle>
        <CardDescription> Create a new account </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="grid gap-4" @submit.prevent="signup">
          <div class="grid gap-2">
            <Label id="username" class="text-left">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="johndoe19"
              required
              v-model="formData.username"
            />
          </div>
          <!-- More form fields -->
          <Button type="submit" class="w-full"> Register </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
```

## Login Page

### Component Pattern

**File:** `src/pages/login.vue`

```vue
<script setup lang="ts">
import { login } from '@/utils/supaAuth'

const formData = ref({
  email: '',
  password: ''
})

const router = useRouter()

const signin = async () => {
  const isLoggedIn = await login(formData.value)
  if (isLoggedIn) router.push('/')
}
</script>

<template>
  <!-- Similar structure to register page -->
</template>
```

## Route Protection

### Navigation Guard

**File:** `src/router/index.ts`

```typescript
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

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

export default router
```

## Dynamic User Profiles

### Profile Query

**File:** `src/utils/supaQueries.ts`

```typescript
export const profileQuery = ({ column, value }: { column: string; value: string }) => {
  return supabase.from('profiles').select().eq(column, value).single()
}
```

### Profile Page

**File:** `src/pages/users/[username].vue`

```vue
<script setup lang="ts">
import { profileQuery } from '@/utils/supaQueries'
import type { Tables } from '@/database/types'

const { username } = useRoute('/users/[username]').params

const profile = ref<Tables<'profiles'> | null>(null)

const getProfile = async () => {
  const { data, error, status } = await profileQuery({ column: 'username', value: username })
  if (error) useErrorStore().setError({ error, customCode: status })
  profile.value = data
}

await getProfile()

watch(
  () => profile.value?.full_name || profile.value?.username,
  (name) => {
    usePageStore().pageData.title = name ? `User: ${name}` : ''
  }
)
</script>

<template>
  <div class="mx-auto mb-10 flex w-full flex-col items-center justify-center py-10 text-center">
    <div class="flex flex-col items-center justify-center pb-4">
      <Avatar size="lg">
        <AvatarImage :src="profile?.avatar_url || ''" alt="@radix-vue" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <p class="mt-2 text-gray-500">{{ profile?.username }}</p>
      <h1 class="mt-5 text-4xl font-bold">{{ profile?.full_name }}</h1>
      <p class="mt-2 text-sm">{{ profile?.bio }}</p>
    </div>
    <Button>Edit profile</Button>
  </div>
</template>
```

## Best Practices

1. **Profile creation:** Create profile automatically on registration
2. **Session management:** Track auth state changes with `onAuthStateChange`
3. **Route protection:** Use navigation guards to protect authenticated routes
4. **Error handling:** Handle auth errors gracefully
5. **Type safety:** Use TypeScript interfaces for form data
6. **Code organization:** Extract auth logic to utility functions

## Common Gotchas

1. **Session timing:** Wait for session before checking auth state
2. **Profile sync:** Sync profile data when auth state changes
3. **Route guards:** Use `beforeEach` with async session check
4. **Form validation:** Validate forms before submission
5. **Error messages:** Show user-friendly error messages

## References

- [Supabase Auth](https://supabase.com/docs/reference/javascript/auth-api)
- [Vue Router Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html)
