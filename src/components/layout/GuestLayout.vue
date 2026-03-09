<script setup lang="ts"></script>

<template>
  <div class="min-h-screen flex flex-col bg-background">
    <header class="border-b bg-muted/40 px-4 py-3 flex items-center justify-between shrink-0">
      <RouterLink to="/" class="text-lg font-semibold text-primary">Vue PM Demo</RouterLink>
      <nav class="flex items-center gap-3">
        <RouterLink
          to="/readme"
          class="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Setup & docs
        </RouterLink>
        <RouterLink to="/login" class="text-sm font-medium hover:underline">Login</RouterLink>
        <RouterLink
          to="/register"
          class="text-sm font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
        >
          Register
        </RouterLink>
      </nav>
    </header>
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
