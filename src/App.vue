<script setup lang="ts">
import { useErrorStore } from './stores/error'

const errorStore = useErrorStore()
const route = useRoute()

const isGuestRoute = computed(() => {
  const p = route.path
  return p === '/' || p === '/login' || p === '/register' || p === '/readme'
})

onErrorCaptured((error) => {
  errorStore.setError({ error })
})

onMounted(() => {
  useAuthStore().trackAuthChanges()
})
</script>

<template>
  <GuestLayout v-if="isGuestRoute">
    <AppErrorPage v-if="errorStore.activeError" />
    <RouterView v-else v-slot="{ Component, route: r }">
      <Suspense v-if="Component" :timeout="0">
        <Component v-if="Component" :is="Component" :key="r.name" />
        <template #fallback>
          <span>Loading...</span>
        </template>
      </Suspense>
    </RouterView>
  </GuestLayout>
  <AuthLayout v-else>
    <AppErrorPage v-if="errorStore.activeError" />
    <RouterView v-else v-slot="{ Component, route: r }">
      <Suspense v-if="Component" :timeout="0">
        <Component v-if="Component" :is="Component" :key="r.name" />
        <template #fallback>
          <span>Loading...</span>
        </template>
      </Suspense>
    </RouterView>
  </AuthLayout>
</template>
