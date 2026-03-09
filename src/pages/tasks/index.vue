<script setup lang="ts">
import { tasksWithProjectsQuery } from '@/utils/supaQueries'
import type { TasksWithProjects } from '@/utils/supaQueries'
import { columns } from '@/utils/tableColumns/tasksColumns'

usePageStore().pageData.title = 'My Tasks'

const tasks = ref<TasksWithProjects | null>(null)
const getTasks = async () => {
  const { data, error, status } = await tasksWithProjectsQuery

  if (error) useErrorStore().setError({ error, customCode: status })

  tasks.value = data
}

await getTasks()

const { getGroupedCollabs, groupedCollabs } = useCollabs()
await getGroupedCollabs(tasks.value ?? [])

const columnsWithCollabs = columns(groupedCollabs)
</script>
<template>
  <DataTable v-if="tasks" :columns="columnsWithCollabs" :data="tasks" />
</template>
