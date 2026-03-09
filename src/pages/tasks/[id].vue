<script setup lang="ts">
import { taskQuery, updateTaskQuery } from '@/utils/supaQueries'
import type { Task } from '@/utils/supaQueries'
import type { Collabs } from '@/utils/supaQueries'

const route = useRoute('/tasks/[id]')

const task = ref<Task | null>(null)
const collabProfiles = ref<Collabs>([])

const { getProfilesByIds } = useCollabs()

watch(
  () => task.value?.name,
  () => {
    usePageStore().pageData.title = `Task: ${task.value?.name || ''}`
  }
)

const getTask = async () => {
  const { data, error, status } = await taskQuery(route.params.id)

  if (error) useErrorStore().setError({ error, customCode: status })

  task.value = data
  if (data?.collaborators?.length) {
    const profiles = await getProfilesByIds(data.collaborators)
    collabProfiles.value = profiles ?? []
  }
}

const updateTask = async () => {
  if (!task.value) return
  const { projects: _projects, id, ...taskProperties } = task.value
  await updateTaskQuery(taskProperties as Record<string, unknown>, id)
  await getTask()
}

await getTask()
</script>

<template>
  <Table v-if="task">
    <TableRow>
      <TableHead> Name </TableHead>
      <TableCell>
        <AppInPlaceEditText v-model="task.name" @commit="updateTask" />
      </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Description </TableHead>
      <TableCell>
        <AppInPlaceEditTextarea v-model="task.description" @commit="updateTask" />
      </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Project </TableHead>
      <TableCell>
        <RouterLink
          v-if="task.projects?.slug"
          :to="`/projects/${task.projects.slug}`"
          class="font-medium hover:underline"
        >
          {{ task.projects.name }}
        </RouterLink>
        <span v-else class="text-muted-foreground">—</span>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Status </TableHead>
      <TableCell>
        <AppInPlaceEditStatus v-model="task.status" @commit="updateTask" />
      </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Collaborators </TableHead>
      <TableCell>
        <div class="flex">
          <Avatar
            v-for="collab in collabProfiles"
            :key="collab.id"
            class="-mr-4 border border-primary hover:scale-110 transition-transform"
          >
            <RouterLink
              class="flex h-full w-full items-center justify-center"
              :to="`/users/${collab.username}`"
            >
              <AvatarImage :src="collab.avatar_url || ''" alt="" />
              <AvatarFallback />
            </RouterLink>
          </Avatar>
        </div>
      </TableCell>
    </TableRow>
  </Table>

  <section v-if="task" class="mt-10 flex flex-col md:flex-row gap-5 justify-between grow">
    <div class="flex-1">
      <h2>Comments</h2>
      <div class="table-container">
        <p class="text-muted-foreground px-4 py-3 text-sm">
          Coming soon.
        </p>
      </div>
    </div>
  </section>
</template>

<style>
@reference "@/assets/index.css"
th {
  @apply w-[100px];
}

h2 {
  @apply mb-4 text-lg font-semibold w-fit;
}

.table-container {
  @apply overflow-hidden overflow-y-auto rounded-md bg-slate-900 h-80;
}
</style>
