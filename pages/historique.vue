<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWorkoutsStore } from '~/stores/workouts'
import { useExercisesStore } from '~/stores/exercises'
import { useStats, workoutVolume } from '~/composables/useStats'

const workoutsStore = useWorkoutsStore()
const exercisesStore = useExercisesStore()
const { personalRecord } = useStats()

const filterExercise = ref('')

const filtered = computed(() => {
  if (!filterExercise.value) return workoutsStore.sortedByDateDesc
  return workoutsStore.sortedByDateDesc.filter((w) =>
    w.exercises.some((e) => e.exerciseId === filterExercise.value)
  )
})

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

/** Une perf est un PR si sa charge max égale le record global de l'exercice */
function isPr(exerciseId: string, sets: { weight: number }[]): boolean {
  const record = personalRecord(exerciseId)
  if (record === null || record === 0) return false
  return sets.some((s) => s.weight === record)
}

function removeWorkout(id: string) {
  if (confirm('Supprimer cette séance ?')) workoutsStore.remove(id)
}
</script>

<template>
  <div class="grid">
    <h1>Historique</h1>

    <div class="filters">
      <label for="filter">Filtrer par exercice</label>
      <select id="filter" v-model="filterExercise">
        <option value="">Tous les exercices</option>
        <option v-for="e in exercisesStore.exercises" :key="e.id" :value="e.id">
          {{ e.name }}
        </option>
      </select>
    </div>

    <p v-if="filtered.length === 0" class="card">
      Aucune séance à afficher.
      <NuxtLink to="/seance/nouvelle">Enregistrer une séance</NuxtLink>
    </p>

    <article v-for="w in filtered" :key="w.id" class="card">
      <div class="workout-head">
        <h2>{{ formatDate(w.date) }}</h2>
        <span class="volume">{{ workoutVolume(w) }} kg</span>
        <button class="btn-ghost small" @click="removeWorkout(w.id)">Supprimer</button>
      </div>
      <ExerciseCard
        v-for="e in w.exercises"
        :key="e.id"
        :exercise="e"
        :is-pr="isPr(e.exerciseId, e.sets)"
      />
      <p v-if="w.notes" class="notes">{{ w.notes }}</p>
    </article>
  </div>
</template>

<style scoped>
.filters { max-width: 20rem; }
.workout-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.workout-head h2 { flex: 1; margin: 0; font-size: 1.1rem; }
.volume {
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--ink-soft);
}
.small { padding: 0.3rem 0.6rem; font-size: 0.8rem; }
.notes {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  color: var(--ink-soft);
  font-style: italic;
}
</style>
