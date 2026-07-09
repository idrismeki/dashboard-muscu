import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { Workout } from '~/types/workout'
import { loadJSON, saveJSON } from '~/utils/storage'

const STORAGE_KEY = 'dm.workouts'

export const useWorkoutsStore = defineStore('workouts', () => {
  const workouts = ref<Workout[]>(loadJSON(STORAGE_KEY, []))

  watch(workouts, (v) => saveJSON(STORAGE_KEY, v), { deep: true })

  const sortedByDateDesc = computed(() =>
    [...workouts.value].sort((a, b) => b.date.localeCompare(a.date))
  )

  function add(workout: Workout): void {
    workouts.value.push(workout)
  }

  function remove(id: string): void {
    workouts.value = workouts.value.filter((w) => w.id !== id)
  }

  /** Séances contenant un exercice donné, triées par date croissante */
  function byExercise(exerciseId: string): Workout[] {
    return [...workouts.value]
      .filter((w) => w.exercises.some((e) => e.exerciseId === exerciseId))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  return { workouts, sortedByDateDesc, add, remove, byExercise }
})
