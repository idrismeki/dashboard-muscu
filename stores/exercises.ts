import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ExerciseDefinition, MuscleGroup } from '~/types/workout'
import { loadJSON, saveJSON, uid } from '~/utils/storage'

const STORAGE_KEY = 'dm.exercises'

const DEFAULTS: ExerciseDefinition[] = [
  { id: 'squat', name: 'Squat', muscleGroup: 'jambes', isCustom: false },
  { id: 'souleve-terre', name: 'Soulevé de terre', muscleGroup: 'dos', isCustom: false },
  { id: 'developpe-couche', name: 'Développé couché', muscleGroup: 'pectoraux', isCustom: false },
  { id: 'developpe-militaire', name: 'Développé militaire', muscleGroup: 'épaules', isCustom: false },
  { id: 'tractions', name: 'Tractions', muscleGroup: 'dos', isCustom: false },
  { id: 'rowing-barre', name: 'Rowing barre', muscleGroup: 'dos', isCustom: false },
  { id: 'curl-biceps', name: 'Curl biceps', muscleGroup: 'bras', isCustom: false },
  { id: 'dips', name: 'Dips', muscleGroup: 'bras', isCustom: false },
  { id: 'presse-cuisses', name: 'Presse à cuisses', muscleGroup: 'jambes', isCustom: false },
  { id: 'gainage', name: 'Gainage', muscleGroup: 'core', isCustom: false }
]

export const useExercisesStore = defineStore('exercises', () => {
  const exercises = ref<ExerciseDefinition[]>(loadJSON(STORAGE_KEY, DEFAULTS))

  watch(exercises, (v) => saveJSON(STORAGE_KEY, v), { deep: true })

  function addCustom(name: string, muscleGroup: MuscleGroup): ExerciseDefinition {
    const def: ExerciseDefinition = { id: uid(), name: name.trim(), muscleGroup, isCustom: true }
    exercises.value.push(def)
    return def
  }

  function byId(id: string): ExerciseDefinition | undefined {
    return exercises.value.find((e) => e.id === id)
  }

  return { exercises, addCustom, byId }
})
