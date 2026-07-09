<script setup lang="ts">
import { computed } from 'vue'
import type { WorkoutExercise } from '~/types/workout'
import { useExercisesStore } from '~/stores/exercises'
import { setsVolume } from '~/composables/useStats'

const props = defineProps<{ exercise: WorkoutExercise; isPr?: boolean }>()

const exercisesStore = useExercisesStore()
const definition = computed(() => exercisesStore.byId(props.exercise.exerciseId))
const volume = computed(() => setsVolume(props.exercise.sets))
</script>

<template>
  <div class="exercise">
    <div class="exercise-head">
      <strong>{{ definition?.name ?? 'Exercice supprimé' }}</strong>
      <span v-if="definition" :class="['chip', `chip-${definition.muscleGroup}`]">
        {{ definition.muscleGroup }}
      </span>
      <span v-if="isPr" class="badge-pr">PR</span>
    </div>
    <ul class="sets">
      <li v-for="(s, i) in exercise.sets" :key="i">
        {{ s.reps }} reps × {{ s.weight }} kg
      </li>
    </ul>
    <span class="volume">Volume : {{ volume }} kg</span>
  </div>
</template>

<style scoped>
.exercise { padding: 0.6rem 0; border-top: 1px solid var(--line); }
.exercise-head { display: flex; align-items: center; gap: 0.5rem; }
.sets {
  list-style: none;
  margin: 0.3rem 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1rem;
  font-size: 0.95rem;
  color: var(--ink-soft);
}
.volume { font-size: 0.8rem; color: var(--ink-soft); }
</style>
