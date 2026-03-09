<script setup lang="ts">
const auth = useAuthStore()
const router = useRouter()

usePageStore().pageData.title = 'Profile'

onMounted(async () => {
  await auth.getSession()
  if (auth.profile?.username) {
    router.replace(`/users/${auth.profile.username}`)
    return
  }
})
</script>

<template>
  <div class="mx-auto max-w-lg py-10">
    <h1 class="text-2xl font-semibold">Profile</h1>
    <p class="mt-2 text-muted-foreground">
      View and edit your profile. If you're logged in, you'll be redirected to your profile page.
    </p>
  </div>
</template>
