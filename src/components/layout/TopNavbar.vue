<script setup lang="ts">
const router = useRouter()
const auth = useAuthStore()

const displayName = computed(() => {
  if (auth.profile?.full_name) return auth.profile.full_name
  if (auth.user?.email) return auth.user.email
  return 'User'
})

const initials = computed(() => {
  const name = auth.profile?.full_name?.trim() || auth.user?.email?.split('@')[0] || 'U'
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    const first = parts[0]?.[0] ?? ''
    const last = parts[parts.length - 1]?.[0] ?? ''
    return (first + last).toUpperCase().slice(0, 2)
  }
  return name.slice(0, 2).toUpperCase()
})

const handleSignOut = async () => {
  const { logout } = await import('@/utils/supaAuth')
  const ok = await logout()
  if (ok) router.push('/')
}
</script>

<template>
  <nav class="flex h-16 items-center justify-between gap-2 border-b bg-muted/40 px-6">
    <form class="relative h-fit w-full max-w-96">
      <iconify-icon
        class="absolute left-2.5 top-[50%] translate-y-[-50%] text-muted-foreground"
        icon="lucide:search"
      />
      <Input class="w-full pl-8 bg-background" type="text" placeholder="Search ..." />
    </form>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar class="h-9 w-9">
          <AvatarImage :src="auth.profile?.avatar_url ?? ''" alt="" />
          <AvatarFallback>{{ initials }}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-48">
        <DropdownMenuLabel>{{ displayName }}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <RouterLink to="/profile">Profile</RouterLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <RouterLink to="/settings">Settings</RouterLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" @select="handleSignOut">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </nav>
</template>
