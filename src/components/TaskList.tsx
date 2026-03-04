import React, { useRef } from 'react'
import { Task, Category } from '@/types'
import TaskCard from './TaskCard'

interface Props {
  tasks: Task[]
  categories: Category[]
  onToggle: (id: string) => void
  onEdit: (id: string) => void
  onReorder: (reordered: Task[]) => void
}

export default function TaskList({ tasks, categories, onToggle, onEdit, onReorder }: Props) {
  const draggedId = useRef<string | null>(null)

  const handleDragStart = (_e: React.DragEvent, id: string) => {
    draggedId.current = id
  }

  const handleDragOver = (e: React.DragEvent, _id: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    const sourceId = draggedId.current
    if (!sourceId || sourceId === targetId) return

    const si = tasks.findIndex(t => t.id === sourceId)
    const ti = tasks.findIndex(t => t.id === targetId)
    if (si < 0 || ti < 0) return

    const reordered = [...tasks]
    const [removed] = reordered.splice(si, 1)
    reordered.splice(ti, 0, removed)
    reordered.forEach((t, i) => (t.order = i))
    onReorder(reordered)
  }

  const handleDragEnd = (_e: React.DragEvent) => {
    draggedId.current = null
  }

  if (!tasks.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-secondary">
        <svg className="w-12 h-12 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <p className="text-sm">Sin tareas aquí</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          categories={categories}
          onToggle={() => onToggle(task.id)}
          onEdit={() => onEdit(task.id)}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  )
}
