import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Task, Category, Subtask } from '@/types'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { Save, Check } from 'lucide-react'

interface Props {
  isOpen: boolean
  editingTask: Task | null
  categories: Category[]
  onClose: () => void
  onSave: (payload: Omit<Task, 'id' | 'createdAt' | 'completed' | 'order'>, id?: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function TaskPanel({ isOpen, editingTask, categories, onClose, onSave, onDelete }: Props) {
  const [title,    setTitle]    = useState('')
  const [desc,     setDesc]     = useState('')
  const [dueDate,  setDueDate]  = useState('')
  const [priority, setPriority] = useState<Task['priority']>('none')
  const [category, setCategory] = useState('')
  const [subtasks, setSubtasks] = useState<Subtask[]>([{ text: '', done: false }])

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title)
      setDesc(editingTask.description || '')
      setDueDate(editingTask.dueDate || '')
      setPriority(editingTask.priority)
      setCategory(editingTask.category || '')
      setSubtasks(editingTask.subtasks?.length ? editingTask.subtasks : [{ text: '', done: false }])
    } else {
      setTitle(''); setDesc(''); setDueDate('')
      setPriority('none'); setCategory('')
      setSubtasks([{ text: '', done: false }])
    }
  }, [editingTask, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const payload = {
      title: title.trim(),
      description: desc.trim(),
      dueDate: dueDate || null,
      priority,
      category: category || null,
      subtasks: subtasks.filter(s => s.text.trim()),
    }
    await onSave(payload, editingTask?.id)
    onClose()
  }

  const handleDelete = async () => {
    if (!editingTask || !confirm('¿Eliminar esta tarea?')) return
    await onDelete(editingTask.id)
    onClose()
  }

  const addSubtask = () => setSubtasks(prev => [...prev, { text: '', done: false }])
  const updateSubtask = (i: number, patch: Partial<Subtask>) =>
    setSubtasks(prev => prev.map((s, idx) => idx === i ? { ...s, ...patch } : s))
  const removeSubtask = (i: number) =>
    setSubtasks(prev => prev.filter((_, idx) => idx !== i))

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-surface/95 backdrop-blur-xl border-l border-border z-50 overflow-y-auto shadow-modal"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                {editingTask ? 'Editar tarea' : 'Nueva tarea'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Título</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="¿Qué hay que hacer?"
                    autoFocus
                    className="w-full px-4 py-3 rounded-lg bg-surface-card border border-border text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Descripción</label>
                  <textarea
                    rows={3}
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    placeholder="Notas opcionales..."
                    className="w-full px-4 py-3 rounded-lg bg-surface-card border border-border text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Fecha de vencimiento</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-surface-card border border-border text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Prioridad</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as Task['priority'])}
                    className="w-full px-4 py-3 rounded-lg bg-surface-card border border-border text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 shadow-sm"
                  >
                    <option value="none">Ninguna</option>
                    <option value="high">Alta</option>
                    <option value="medium">Media</option>
                    <option value="low">Baja</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-surface-card border border-border text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 shadow-sm"
                  >
                    <option value="">Sin categoría</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Subtareas</label>
                  <div className="space-y-2">
                    {subtasks.map((st, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="subtask-check"
                          checked={st.done}
                          onChange={e => updateSubtask(i, { done: e.target.checked })}
                        />
                        <input
                          type="text"
                          value={st.text}
                          onChange={e => updateSubtask(i, { text: e.target.value })}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubtask() } }}
                          placeholder="Subtarea..."
                          className="flex-1 px-3 py-2 rounded-lg bg-surface-card border border-border text-sm placeholder-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeSubtask(i)}
                          className="p-1 text-secondary hover:text-priority-high transition-colors"
                          aria-label="Eliminar subtarea"
                        >✕</button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addSubtask}
                    className="mt-2 text-sm text-accent hover:text-indigo-400 transition-colors"
                  >
                    + Añadir subtarea
                  </button>
                </div>

                <div className="flex gap-3 pt-4">
                  <InteractiveHoverButton
                    type="submit"
                    text={editingTask ? 'Actualizar' : 'Guardar'}
                    icon={editingTask ? <Check size={16} /> : <Save size={16} />}
                    className="flex-1 w-full border-accent/60 bg-accent/10 text-primary [&_.absolute]:bg-accent"
                  />
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-primary border border-border transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                </div>

                {editingTask && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="w-full px-4 py-2 rounded-lg bg-priority-high/10 hover:bg-priority-high/20 text-priority-high text-sm border border-transparent hover:border-priority-high/30 transition-all"
                  >
                    Eliminar tarea
                  </button>
                )}
              </form>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
