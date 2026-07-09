import { computed } from 'vue'
import type { ExerciseSet, Workout, WorkoutExercise } from '~/types/workout'
import { useWorkoutsStore } from '~/stores/workouts'

/** Volume d'une liste de séries : Σ (reps × poids) */
export function setsVolume(sets: ExerciseSet[]): number {
  return sets.reduce((total, s) => total + s.reps * s.weight, 0)
}

/** Volume total d'une séance */
export function workoutVolume(workout: Workout): number {
  return workout.exercises.reduce((total, e) => total + setsVolume(e.sets), 0)
}

/** Charge max d'un exercice dans une séance */
function maxWeight(exercise: WorkoutExercise): number {
  return Math.max(0, ...exercise.sets.map((s) => s.weight))
}

export function useStats() {
  const workoutsStore = useWorkoutsStore()

  /** Volume des 7 derniers jours */
  const weeklyVolume = computed(() => {
    const limit = new Date()
    limit.setDate(limit.getDate() - 7)
    const iso = limit.toISOString().slice(0, 10)
    return workoutsStore.workouts
      .filter((w) => w.date >= iso)
      .reduce((total, w) => total + workoutVolume(w), 0)
  })

  /** Nombre de séances sur les 30 derniers jours */
  const monthlySessions = computed(() => {
    const limit = new Date()
    limit.setDate(limit.getDate() - 30)
    const iso = limit.toISOString().slice(0, 10)
    return workoutsStore.workouts.filter((w) => w.date >= iso).length
  })

  /** Record personnel (charge max toutes séances) pour un exercice */
  function personalRecord(exerciseId: string): number | null {
    const sessions = workoutsStore.byExercise(exerciseId)
    if (sessions.length === 0) return null
    let record = 0
    for (const w of sessions) {
      for (const e of w.exercises) {
        if (e.exerciseId === exerciseId) record = Math.max(record, maxWeight(e))
      }
    }
    return record
  }

  /** Série temporelle { date, charge max } pour le graphique de progression */
  function progressSeries(exerciseId: string): { date: string; weight: number }[] {
    return workoutsStore.byExercise(exerciseId).map((w) => {
      const best = w.exercises
        .filter((e) => e.exerciseId === exerciseId)
        .reduce((m, e) => Math.max(m, maxWeight(e)), 0)
      return { date: w.date, weight: best }
    })
  }

  return { weeklyVolume, monthlySessions, personalRecord, progressSeries }
}
