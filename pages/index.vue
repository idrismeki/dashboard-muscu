<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWorkoutsStore } from '~/stores/workouts'
import { useBodyStatsStore } from '~/stores/bodyStats'
import { useExercisesStore } from '~/stores/exercises'
import { useStats } from '~/composables/useStats'

const workoutsStore = useWorkoutsStore()
const bodyStore = useBodyStatsStore()
const exercisesStore = useExercisesStore()
const { weeklyVolume, monthlySessions, personalRecord, progressSeries } = useStats()

// Graphique de progression : exercice sélectionné
const selectedExercise = ref(exercisesStore.exercises[0]?.id ?? '')
const series = computed(() => progressSeries(selectedExercise.value))
const pr = computed(() => personalRecord(selectedExercise.value))
const selectedName = computed(
  () => exercisesStore.byId(selectedExercise.value)?.name ?? ''
)

// Suivi corporel
const newWeight = ref<number | null>(null)
const goalInput = ref<number | null>(bodyStore.goalWeight)
const weightSeries = computed(() =>
  bodyStore.sortedByDateAsc.map((s) => ({ date: s.date, weight: s.weight }))
)

function addWeight() {
  if (newWeight.value && newWeight.value > 0) {
    bodyStore.addEntry(newWeight.value)
    newWeight.value = null
  }
}

function saveGoal() {
  bodyStore.goalWeight = goalInput.value
}

const latestWeightLabel = computed(() =>
  bodyStore.latest ? `${bodyStore.latest.weight} kg` : '—'
)
const goalHint = computed(() =>
  bodyStore.goalWeight ? `Objectif : ${bodyStore.goalWeight} kg` : undefined
)
</script>

<template>
  <div class="grid">
    <h1>Tableau de bord</h1>

    <div class="grid grid-4">
      <StatCard label="Poids actuel" :value="latestWeightLabel" :hint="goalHint" />
      <StatCard label="Volume 7 jours" :value="`${weeklyVolume} kg`" hint="Σ séries × reps × poids" />
      <StatCard label="Séances / 30 j" :value="String(monthlySessions)" />
      <StatCard
        :label="`PR — ${selectedName}`"
        :value="pr !== null ? `${pr} kg` : '—'"
      />
    </div>

    <section class="card">
      <div class="section-head">
        <h2>Progression</h2>
        <select v-model="selectedExercise" aria-label="Exercice affiché">
          <option v-for="e in exercisesStore.exercises" :key="e.id" :value="e.id">
            {{ e.name }}
          </option>
        </select>
      </div>
      <ProgressChart :label="selectedName" :points="series" />
    </section>

    <section class="card">
      <div class="section-head">
        <h2>Poids corporel</h2>
        <form class="inline-form" @submit.prevent="addWeight">
          <input
            v-model.number="newWeight"
            type="number"
            step="0.1"
            min="20"
            placeholder="67.8"
            aria-label="Nouveau poids en kg"
          />
          <button type="submit" class="btn-ghost">Ajouter</button>
        </form>
        <form class="inline-form" @submit.prevent="saveGoal">
          <input
            v-model.number="goalInput"
            type="number"
            step="0.1"
            min="20"
            placeholder="Objectif"
            aria-label="Poids objectif en kg"
          />
          <button type="submit" class="btn-ghost">Objectif</button>
        </form>
      </div>
      <ProgressChart label="Poids (kg)" :points="weightSeries" color="#2456a6" />
    </section>

    <p v-if="workoutsStore.workouts.length === 0" class="card empty-cta">
      Aucune séance enregistrée pour l'instant.
      <NuxtLink to="/seance/nouvelle" class="btn btn-primary">Enregistrer ma première séance</NuxtLink>
    </p>
  </div>
</template>

<style scoped>
.section-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.section-head h2 { margin: 0; flex: 1; }
.section-head select { width: auto; }
.inline-form { display: flex; gap: 0.4rem; }
.inline-form input { width: 6.5rem; }
.empty-cta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
</style>
