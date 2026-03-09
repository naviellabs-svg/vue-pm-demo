<script setup lang="ts">
const repoUrl = 'https://github.com/naviellabs-svg/vue-pm-demo'

const stack = [
  'Vue 3',
  'TypeScript',
  'Vite 7',
  'Vue Router (file-based)',
  'Pinia',
  'Tailwind CSS 4',
  'TanStack Vue Table',
  'reka-ui',
  'VueUse',
  'Lucide icons',
  'Supabase (Auth + PostgreSQL)'
]

const features = [
  'Auth (login / register)',
  'Projects list and detail with in-place edit',
  'Tasks list and detail',
  'User profiles and collaborators',
  'Responsive layout',
  'Error handling'
]
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-12">
    <h1 class="text-2xl font-bold">Setup & docs</h1>
    <p class="mt-2 text-muted-foreground">
      Short summary. Full README and source are on GitHub.
    </p>

    <section class="mt-8">
      <h2 class="text-lg font-semibold">Tech stack</h2>
      <ul class="mt-2 list-inside list-disc text-muted-foreground space-y-1">
        <li v-for="tech in stack" :key="tech">{{ tech }}</li>
      </ul>
    </section>

    <section class="mt-8">
      <h2 class="text-lg font-semibold">Features</h2>
      <ul class="mt-2 list-inside list-disc text-muted-foreground space-y-1">
        <li v-for="f in features" :key="f">{{ f }}</li>
      </ul>
    </section>

    <section class="mt-8">
      <h2 class="text-lg font-semibold">Demo credentials</h2>
      <p class="mt-2 text-muted-foreground text-sm">
        Use the credentials documented in the README (or set in your env). On the login page you can
        click <strong>Fill demo</strong> to pre-fill if <code>VITE_DEMO_EMAIL</code> and
        <code>VITE_DEMO_PASSWORD</code> are set.
      </p>
    </section>

    <section class="mt-8">
      <h2 class="text-lg font-semibold">Local setup</h2>
      <p class="mt-2 text-muted-foreground text-sm">
        <code>npm install</code>, add <code>.env</code> with <code>VITE_SUPABASE_URL</code> and
        <code>VITE_SUPABASE_KEY</code>, then <code>npm run dev</code>. Optional:
        <code>VITE_DEMO_EMAIL</code> and <code>VITE_DEMO_PASSWORD</code> for the Fill demo button.
      </p>
    </section>

    <div class="mt-10">
      <a
        :href="repoUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 rounded-md bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80 transition-colors"
      >
        Full README on GitHub
        <iconify-icon icon="lucide:external-link" class="text-muted-foreground" />
      </a>
    </div>
  </div>
</template>
