<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend)

const props = defineProps<{
  label: string
  points: { date: string; weight: number }[]
  color?: string
}>()

const chartData = computed(() => ({
  labels: props.points.map((p) =>
    new Date(p.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
  ),
  datasets: [
    {
      label: props.label,
      data: props.points.map((p) => p.weight),
      borderColor: props.color ?? '#c0392b',
      backgroundColor: props.color ?? '#c0392b',
      tension: 0.25,
      pointRadius: 4
    }
  ]
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { ticks: { callback: (v: string | number) => `${v} kg` } }
  }
} as const
</script>

<template>
  <div class="chart-wrap">
    <Line v-if="points.length > 0" :data="chartData" :options="options" />
    <p v-else class="empty">
      Pas encore de données. Enregistre une séance pour voir ta progression.
    </p>
  </div>
</template>

<style scoped>
.chart-wrap { position: relative; height: 260px; }
.empty {
  color: var(--ink-soft);
  text-align: center;
  padding-top: 5rem;
}
</style>
