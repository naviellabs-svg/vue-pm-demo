<script setup lang="ts">
import { myTasksWithProjectsQuery } from '@/utils/supaQueries'
import type { TasksWithProjects } from '@/utils/supaQueries'
import CardSparkline from '@/components/dashboard/CardSparkline.vue'

usePageStore().pageData.title = 'Dashboard'

// Subtle background sparklines per card (values 0–1)
const sparklines = {
  projects: [0.2, 0.35, 0.5, 0.55, 0.7, 0.85],
  tasks: [0.4, 0.5, 0.45, 0.65, 0.6, 0.75],
  completed: [0.15, 0.35, 0.55, 0.75, 0.9, 1],
  overdue: [0.5, 0.4, 0.55, 0.45, 0.5, 0.4]
}

const auth = useAuthStore()
const projectsLoader = useProjectsStore()
const { projects } = storeToRefs(projectsLoader)
const { getProjects } = projectsLoader

await getProjects()

const myTasks = ref<TasksWithProjects | null>(null)
if (auth.user?.id) {
  const { data, error, status } = await myTasksWithProjectsQuery(auth.user.id)
  if (error) useErrorStore().setError({ error, customCode: status })
  myTasks.value = data
}

const projectCount = computed(() => projects.value?.length ?? 0)
const taskCount = computed(() => myTasks.value?.length ?? 0)
const completedCount = computed(
  () => myTasks.value?.filter((t) => t.status === 'completed').length ?? 0
)
const today = new Date().toISOString().slice(0, 10)
const overdueCount = computed(
  () =>
    myTasks.value?.filter(
      (t) => t.due_date != null && t.due_date < today
    ).length ?? 0
)

const upcomingTasks = computed(() => {
  const list = myTasks.value ?? []
  return [...list]
    .sort((a, b) => {
      const da = a.due_date ?? '9999-12-31'
      const db = b.due_date ?? '9999-12-31'
      return da.localeCompare(db)
    })
    .slice(0, 5)
})
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-semibold">Welcome</h1>
      <p class="mt-1 text-muted-foreground">
        Here’s an overview of your projects and tasks.
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card class="relative overflow-hidden">
        <CardSparkline :values="sparklines.projects" color="chart-1" />
        <CardHeader class="pb-2 relative">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Projects
          </CardTitle>
        </CardHeader>
        <CardContent class="relative">
          <span class="text-2xl font-bold">{{ projectCount }}</span>
        </CardContent>
      </Card>
      <Card class="relative overflow-hidden">
        <CardSparkline :values="sparklines.tasks" color="chart-2" />
        <CardHeader class="pb-2 relative">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            My tasks
          </CardTitle>
        </CardHeader>
        <CardContent class="relative">
          <span class="text-2xl font-bold">{{ taskCount }}</span>
        </CardContent>
      </Card>
      <Card class="relative overflow-hidden">
        <CardSparkline :values="sparklines.completed" color="chart-3" />
        <CardHeader class="pb-2 relative">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Completed
          </CardTitle>
        </CardHeader>
        <CardContent class="relative">
          <span class="text-2xl font-bold">{{ completedCount }}</span>
        </CardContent>
      </Card>
      <Card class="relative overflow-hidden">
        <CardSparkline :values="sparklines.overdue" color="chart-4" />
        <CardHeader class="pb-2 relative">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Overdue
          </CardTitle>
        </CardHeader>
        <CardContent class="relative">
          <span class="text-2xl font-bold">{{ overdueCount }}</span>
        </CardContent>
      </Card>
    </div>

    <section>
      <h2 class="mb-4 text-lg font-semibold">Upcoming tasks</h2>
      <div
        v-if="upcomingTasks.length"
        class="rounded-md border bg-card"
      >
        <ul class="divide-y">
          <li
            v-for="task in upcomingTasks"
            :key="task.id"
            class="flex items-center justify-between gap-4 px-4 py-3"
          >
            <RouterLink
              :to="`/tasks/${task.id}`"
              class="font-medium hover:underline"
            >
              {{ task.name }}
            </RouterLink>
            <RouterLink
              v-if="task.projects"
              :to="`/projects/${task.projects.slug}`"
              class="text-sm text-muted-foreground hover:underline"
            >
              {{ task.projects.name }}
            </RouterLink>
            <span v-else class="text-sm text-muted-foreground">—</span>
          </li>
        </ul>
      </div>
      <p v-else class="text-sm text-muted-foreground">
        No tasks yet. Open a project to see its tasks, or go to My Tasks.
      </p>
    </section>
  </div>
</template>
