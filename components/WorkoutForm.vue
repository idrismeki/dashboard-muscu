<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { MuscleGroup, Workout, WorkoutExercise } from '~/types/workout'
import { useExercisesStore } from '~/stores/exercises'
import { useWorkoutsStore } from '~/stores/workouts'
import { uid } from '~/utils/storage'

const emit = defineEmits<{ saved: [] }>()

const exercisesStore = useExercisesStore()
const workoutsStore = useWorkoutsStore()

const form = reactive({
  date: new Date().toISOString().slice(0, 10),
  notes: '',
  exercises: [] as WorkoutExercise[]
})

const selectedExerciseId = ref('')

// Exercice personnalisé
const showCustom = ref(false)
const customName = ref('')
const customGroup = ref<MuscleGroup>('pectoraux')
const groups: MuscleGroup[] = ['jambes', 'pectoraux', 'dos', 'épaules', 'bras', 'core']

const error = ref('')

function addExercise() {
  if (!selectedExerciseId.value) return
  form.exercises.push({
    id: uid(),
    exerciseId: selectedExerciseId.value,
    sets: [{ reps: 8, weight: 20 }]
  })
  selectedExerciseId.value = ''
}

function addCustomExercise() {
  if (customName.value.trim().length < 2) {
    error.value = 'Nom d’exercice trop court.'
    return
  }
  const def = exercisesStore.addCustom(customName.value, customGroup.value)
  form.exercises.push({ id: uid(), exerciseId: def.id, sets: [{ reps: 8, weight: 20 }] })
  customName.value = ''
  showCustom.value = false
  error.value = ''
}

function addSet(exercise: WorkoutExercise) {
  const last = exercise.sets.at(-1)
  exercise.sets.push({ reps: last?.reps ?? 8, weight: last?.weight ?? 20 })
}

function removeSet(exercise: WorkoutExercise, index: number) {
  exercise.sets.splice(index, 1)
}

function removeExercise(index: number) {
  form.exercises.splice(index, 1)
}

function save() {
  if (form.exercises.length === 0) {
    error.value = 'Ajoute au moins un exercice avant d’enregistrer.'
    return
  }
  const workout: Workout = {
    id: uid(),
    date: form.date,
    exercises: JSON.parse(JSON.stringify(form.exercises)),
    notes: form.notes.trim() || undefined
  }
  workoutsStore.add(workout)
  form.exercises = []
  form.notes = ''
  error.value = ''
  emit('saved')
}
</script>

<template>
  <form class="card form" @submit.prevent="save">
    <div class="grid grid-2">
      <div>
        <label for="date">Date</label>
        <input id="date" v-model="form.date" type="date" required />
      </div>
      <div>
        <label for="exo">Ajouter un exercice</label>
        <div class="row">
          <select id="exo" v-model="selectedExerciseId">
            <option value="" disabled>Choisir…</option>
            <option v-for="e in exercisesStore.exercises" :key="e.id" :value="e.id">
              {{ e.name }}
            </option>
          </select>
          <button type="button" class="btn-ghost" @click="addExercise">Ajouter</button>
        </div>
        <button type="button" class="link" @click="showCustom = !showCustom">
          + Exercice personnalisé
        </button>
      </div>
    </div>

    <div v-if="showCustom" class="custom card">
      <div class="grid grid-2">
        <div>
          <label for="custom-name">Nom</label>
          <input id="custom-name" v-model="customName" placeholder="Ex : Hip thrust" />
        </div>
        <div>
          <label for="custom-group">Groupe musculaire</label>
          <select id="custom-group" v-model="customGroup">
            <option v-for="g in groups" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>
      </div>
      <button type="button" class="btn-ghost" @click="addCustomExercise">
        Créer et ajouter à la séance
      </button>
    </div>

    <div v-for="(exercise, i) in form.exercises" :key="exercise.id" class="block">
      <div class="block-head">
        <strong>{{ exercisesStore.byId(exercise.exerciseId)?.name }}</strong>
        <button type="button" class="btn-ghost small" @click="removeExercise(i)">
          Retirer
        </button>
      </div>
      <div v-for="(s, j) in exercise.sets" :key="j" class="set-row">
        <span class="set-index">Série {{ j + 1 }}</span>
        <input v-model.number="s.reps" type="number" min="1" aria-label="Répétitions" />
        <span>reps ×</span>
        <input v-model.number="s.weight" type="number" min="0" step="0.5" aria-label="Poids en kg" />
        <span>kg</span>
        <button
          type="button"
          class="btn-ghost small"
          :disabled="exercise.sets.length === 1"
          @click="removeSet(exercise, j)"
        >
          ✕
        </button>
      </div>
      <button type="button" class="btn-ghost small" @click="addSet(exercise)">
        + Série
      </button>
    </div>

    <div>
      <label for="notes">Notes (optionnel)</label>
      <textarea id="notes" v-model="form.notes" rows="2" placeholder="Sensations, tempo…" />
    </div>

    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <button type="submit" class="btn-primary">Enregistrer la séance</button>
  </form>
</template>

<style scoped>
.form { display: flex; flex-direction: column; gap: 1rem; }
.row { display: flex; gap: 0.5rem; }
.row select { flex: 1; }
.link {
  background: none;
  color: var(--plate-20);
  padding: 0.25rem 0;
  font-weight: 600;
}
.custom { background: var(--bg); }
.block { border-top: 1px solid var(--line); padding-top: 0.75rem; }
.block-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.set-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}
.set-row input { width: 5rem; }
.set-index {
  font-size: 0.8rem;
  color: var(--ink-soft);
  min-width: 3.6rem;
}
.small { padding: 0.3rem 0.6rem; font-size: 0.8rem; }
.error { color: var(--plate-25); font-weight: 600; margin: 0; }
</style>
