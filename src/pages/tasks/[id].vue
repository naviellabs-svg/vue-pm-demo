<script setup lang="ts">
import { taskQuery } from '@/utils/supaQueries'
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

await getTask()
</script>

<template>
  <Table v-if="task">
    <TableRow>
      <TableHead> Name </TableHead>
      <TableCell> {{ task.name }} </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Description </TableHead>
      <TableCell>
        {{ task.description }}
      </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Project </TableHead>
      <TableCell> {{ task.projects?.name }} </TableCell>
    </TableRow>
    <TableRow>
      <TableHead> Status </TableHead>
      <TableCell>{{ task.status }}</TableCell>
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
    <TableRow class="hover:bg-transparent">
      <TableHead class="align-top pt-4"> Comments </TableHead>
      <TableCell class="text-muted-foreground">
        Coming soon.
      </TableCell>
    </TableRow>
  </Table>
</template>
