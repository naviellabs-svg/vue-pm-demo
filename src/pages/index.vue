<script setup lang="ts">
usePageStore().pageData.title = 'Homepage'
</script>
<template>
  <div>
    <h1 class="text-2xl font-semibold">Welcome</h1>
    <p class="mt-2 text-muted-foreground">
      Use the sidebar to open Projects or My Tasks.
    </p>
  </div>
</template>
