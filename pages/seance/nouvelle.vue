<script setup lang="ts">
const router = useRouter()

function onSaved() {
  router.push('/historique')
}
</script>

<template>
  <div class="grid">
    <h1>Nouvelle séance</h1>
    <WorkoutForm @saved="onSaved" />
  </div>
</template>
