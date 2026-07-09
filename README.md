# Dashboard Muscu

Suivi d'entraînement de musculation : séances, progression par exercice, records personnels et poids corporel. Données stockées en local (localStorage), aucune inscription nécessaire.

Projet personnel construit avec **Nuxt 3 + TypeScript + Pinia + Chart.js**.

## Fonctionnalités

- **Saisie de séance** — exercices, séries × reps × poids, notes. Liste d'exercices prédéfinie + exercices personnalisés.
- **Historique** — séances passées, filtrables par exercice, volume total par séance.
- **Progression** — graphique d'évolution de la charge max par exercice (Chart.js).
- **Records personnels** — badge PR sur les meilleures performances.
- **Suivi corporel** — courbe de poids + objectif.

## Stack & choix techniques

| Choix | Pourquoi |
|---|---|
| Nuxt 3 en mode SPA (`ssr: false`) | L'app repose sur localStorage : pas de SSR, donc pas de problèmes d'hydratation ni de garde `import.meta.client`. |
| Sets modélisés en `{ reps, weight }[]` | Permet les séries pyramidales/dégressives et rend le calcul de volume trivial (`reduce`). |
| Dates en string ISO 8601 | localStorage sérialise en JSON : autant assumer le format string dès le modèle. |
| Exercices normalisés (`exerciseId` → `ExerciseDefinition`) | Évite les doublons "Squat"/"squat" et fiabilise les graphiques de progression. |
| Stores Pinia (setup syntax) avec `watch` → localStorage | Persistance automatique, réactive, sans plugin externe. |

## Lancer le projet

```bash
npm install
npm run dev
```

Ouvre http://localhost:3000

## Structure

```
pages/          index (dashboard), seance/nouvelle, historique
components/     StatCard, WorkoutForm, ProgressChart, ExerciseCard
stores/         exercises.ts, workouts.ts, bodyStats.ts
composables/    useStats.ts (volume, PR, séries de progression)
types/          workout.ts
utils/          storage.ts (localStorage + uid)
```

## Pistes d'évolution

- Supabase pour la synchro multi-device
- PWA installable pour la salle
- Mode sombre
- Volume hebdomadaire par groupe musculaire
