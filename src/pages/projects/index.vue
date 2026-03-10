<script setup lang="ts">
import { columns } from '@/utils/tableColumns/projectsColumns'

usePageStore().pageData.title = 'Projects'

const projectsLoader = useProjectsStore()
const { projects } = storeToRefs(projectsLoader)
const { getProjects } = projectsLoader

await getProjects()

const { getGroupedCollabs, groupedCollabs } = useCollabs()

getGroupedCollabs(projects.value ?? [])

const columnsWithCollabs = columns(groupedCollabs)


</script>
<template>
  <Card v-if="projects && projects.length === 0" class="max-w-lg">
    <CardHeader>
      <CardTitle>No projects yet</CardTitle>
      <CardDescription>
        Use the sidebar to get started. Projects you’re added to will appear here.
      </CardDescription>
    </CardHeader>
  </Card>
  <DataTable v-else-if="projects" :columns="columnsWithCollabs" :data="projects" />
</template>
