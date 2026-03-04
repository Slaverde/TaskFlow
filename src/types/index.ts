export interface Subtask {
  text: string
  done: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string | null
  priority: 'high' | 'medium' | 'low' | 'none'
  category: string | null
  completed: boolean
  order: number
  createdAt: string
  subtasks: Subtask[]
}

export interface Category {
  id: string
  name: string
  color: string
}

export interface Settings {
  darkMode: boolean
  currentSort: 'manual' | 'priority' | 'date' | 'created'
}

export type View = 'hoy' | 'proximos' | 'todas' | 'calendario' | 'completadas'
export type Filter = 'activas' | 'alta' | 'con-fecha' | null
export type SortOrder = 'manual' | 'priority' | 'date' | 'created'
