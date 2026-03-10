<script setup lang="ts">
/**
 * Renders a subtle SVG area sparkline as card background.
 * values: array of numbers 0–1 (height at each point)
 */
const props = withDefaults(
  defineProps<{
    values: number[]
    /** Tailwind color name for fill (e.g. primary, chart-1) */
    color?: string
  }>(),
  { color: 'primary' }
)

const width = 140
const height = 56
const padding = { top: 8, right: 8, bottom: 8, left: 8 }
const chartWidth = width - padding.left - padding.right
const chartHeight = height - padding.top - padding.bottom

const pathD = computed(() => {
  const vals = props.values.length ? props.values : [0.3, 0.5, 0.4, 0.6, 0.5]
  const n = vals.length
  const step = chartWidth / Math.max(n - 1, 1)
  const points = vals.map((v, i) => {
    const x = padding.left + i * step
    const y = padding.top + chartHeight - v * chartHeight
    return `${x},${y}`
  })
  const line = `M ${points.join(' L ')}`
  const area = `${line} L ${padding.left + chartWidth},${padding.top + chartHeight} L ${padding.left},${padding.top + chartHeight} Z`
  return area
})
</script>

<template>
  <svg
    class="pointer-events-none absolute bottom-0 right-0 h-full w-full opacity-[0.12]"
    :class="{
      'text-primary': color === 'primary',
      'text-chart-1': color === 'chart-1',
      'text-chart-2': color === 'chart-2',
      'text-chart-3': color === 'chart-3',
      'text-chart-4': color === 'chart-4',
      'text-muted-foreground': color === 'muted'
    }"
    viewBox="0 0 140 56"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path :d="pathD" fill="currentColor" />
  </svg>
</template>
