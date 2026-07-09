export type MuscleGroup =
  | 'jambes'
  | 'pectoraux'
  | 'dos'
  | 'épaules'
  | 'bras'
  | 'core'

export interface ExerciseDefinition {
  id: string
  name: string
  muscleGroup: MuscleGroup
  isCustom: boolean
}

export interface ExerciseSet {
  reps: number
  weight: number // kg
}

export interface WorkoutExercise {
  id: string
  exerciseId: string // référence ExerciseDefinition
  sets: ExerciseSet[]
}

export interface Workout {
  id: string
  date: string // ISO 8601
  exercises: WorkoutExercise[]
  notes?: string
}

export interface BodyStat {
  id: string
  date: string // ISO 8601
  weight: number // kg
  measurements?: {
    waist?: number
    chest?: number
    arms?: number
  }
}
