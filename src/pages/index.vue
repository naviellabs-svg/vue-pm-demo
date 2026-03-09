<script setup lang="ts">
// Landing page: only reached when unauthenticated (router redirects logged-in users to /projects)
const stack = [
  'Vue 3',
  'TypeScript',
  'Vite 7',
  'Pinia',
  'Tailwind CSS 4',
  'Supabase',
  'TanStack Table'
]
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-16 md:py-24 text-center">
    <h1 class="text-4xl font-bold tracking-tight md:text-5xl">
      Project & task management
    </h1>
    <p class="mt-4 text-lg text-muted-foreground md:text-xl">
      A full-stack SPA with Vue 3, Supabase, and Tailwind — auth, projects, tasks, and collaborators.
    </p>

    <div class="mt-10 flex flex-wrap justify-center gap-2">
      <span
        v-for="tech in stack"
        :key="tech"
        class="rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground"
      >
        {{ tech }}
      </span>
    </div>

    <div class="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
      <RouterLink
        to="/login"
        class="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto"
      >
        Try demo
      </RouterLink>
      <RouterLink
        to="/login"
        class="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent w-full sm:w-auto"
      >
        Login
      </RouterLink>
      <RouterLink
        to="/register"
        class="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground px-6 py-3 text-sm font-medium hover:bg-secondary/80 w-full sm:w-auto"
      >
        Register
      </RouterLink>
    </div>

    <p class="mt-8 text-sm text-muted-foreground">
      <RouterLink to="/readme" class="underline hover:text-foreground">Setup & docs</RouterLink>
      — stack, features, and how to run locally.
    </p>
  </div>
</template>
