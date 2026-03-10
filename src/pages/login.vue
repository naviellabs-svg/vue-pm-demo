<script setup lang="ts">
import { login } from '@/utils/supaAuth'
import { watchDebounced } from '@vueuse/core'

const formData = ref({
  email: '',
  password: ''
})

const { serverError, handelServerError, realtimeErrors, handelLoginForm } = useFormerrors()

const router = useRouter()
const demoSigningIn = ref(false)

watchDebounced(
  formData,
  () => {
    handelLoginForm(formData.value)
  },
  { debounce: 1000, deep: true }
)

const signin = async () => {
  serverError.value = ''
  const { error } = await login(formData.value)

  if (!error) return router.push('/dashboard')

  handelServerError(error)
}

const demoLogin = async () => {
  const email = import.meta.env.VITE_DEMO_EMAIL as string | undefined
  const password = import.meta.env.VITE_DEMO_PASSWORD as string | undefined

  if (!email || !password) {
    serverError.value =
      'Demo login is not configured. Set VITE_DEMO_EMAIL and VITE_DEMO_PASSWORD in your deploy environment and redeploy.'
    return
  }

  formData.value.email = email
  formData.value.password = password

  demoSigningIn.value = true
  try {
    await signin()
  } finally {
    demoSigningIn.value = false
  }
}
</script>

<template>
  <div class="mx-auto flex w-full justify-center items-center p-10 text-center -mt-20 min-h-[90vh]">
    <Card class="max-w-sm w-full mx-auto">
      <CardHeader>
        <CardTitle class="text-2xl"> Login </CardTitle>
        <CardDescription> Login to your account </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col gap-4 mb-4 justify-center items-center">
          <Button variant="outline" class="w-full"> Register with Google </Button>
          <Separator label="Or" />
        </div>

        <form class="grid gap-4" @submit.prevent="signin">
          <div class="grid gap-2">
            <Label id="email" class="text-left">Email</Label>
            <Input
              type="email"
              placeholder="johndoe19@example.com"
              required
              v-model="formData.email"
              :class="{ 'border-red-500': serverError }"
            />
            <ul class="text-sm text-left text-red-500" v-if="realtimeErrors?.email.length">
              <li v-for="error in realtimeErrors.email" :key="error" class="list-disc">
                {{ error }}
              </li>
            </ul>
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label id="password">Password</Label>
              <a href="#" class="inline-block ml-auto text-xs underline"> Forgot your password? </a>
            </div>
            <Input
              id="password"
              type="password"
              autocomplete
              required
              v-model="formData.password"
              :class="{ 'border-red-500': serverError }"
            />
            <ul class="text-sm text-left text-red-500" v-if="realtimeErrors?.password.length">
              <li v-for="error in realtimeErrors.password" :key="error" class="list-disc">
                {{ error }}
              </li>
            </ul>
          </div>
          <ul class="text-sm text-left text-red-500" v-if="serverError">
            <li class="list-disc">{{ serverError }}</li>
          </ul>
          <Button type="submit" class="w-full"> Login </Button>
          <Button
            type="button"
            variant="outline"
            class="w-full"
            :disabled="demoSigningIn"
            @click="demoLogin"
          >
            {{ demoSigningIn ? 'Signing in…' : 'Continue as demo' }}
          </Button>
        </form>
        <div class="mt-4 text-sm text-center">
          Don't have an account?
          <RouterLink to="/register" class="underline"> Register </RouterLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
