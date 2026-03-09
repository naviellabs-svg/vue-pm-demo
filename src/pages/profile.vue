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
  <div class="max-w-lg py-10 text-left self-start">
    <p class="text-muted-foreground">
      View and edit your profile. If you're logged in, you'll be redirected to your profile page.
    </p>
  </div>
</template>
