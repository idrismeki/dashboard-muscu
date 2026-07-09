import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { BodyStat } from '~/types/workout'
import { loadJSON, saveJSON, uid } from '~/utils/storage'

const STORAGE_KEY = 'dm.bodyStats'
const GOAL_KEY = 'dm.goalWeight'

export const useBodyStatsStore = defineStore('bodyStats', () => {
  const stats = ref<BodyStat[]>(loadJSON(STORAGE_KEY, []))
  const goalWeight = ref<number | null>(loadJSON(GOAL_KEY, null))

  watch(stats, (v) => saveJSON(STORAGE_KEY, v), { deep: true })
  watch(goalWeight, (v) => saveJSON(GOAL_KEY, v))

  const sortedByDateAsc = computed(() =>
    [...stats.value].sort((a, b) => a.date.localeCompare(b.date))
  )

  const latest = computed<BodyStat | null>(
    () => sortedByDateAsc.value.at(-1) ?? null
  )

  function addEntry(weight: number, date?: string): void {
    stats.value.push({
      id: uid(),
      date: date ?? new Date().toISOString().slice(0, 10),
      weight
    })
  }

  function remove(id: string): void {
    stats.value = stats.value.filter((s) => s.id !== id)
  }

  return { stats, goalWeight, sortedByDateAsc, latest, addEntry, remove }
})
