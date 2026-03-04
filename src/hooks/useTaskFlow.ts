import { useState, useEffect, useCallback } from 'react'
import { User } from 'firebase/auth'
import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  setDoc, getDoc, writeBatch, query, orderBy,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Task, Category, Settings } from '@/types'

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'universidad', name: 'Universidad', color: 'blue'    },
  { id: 'personal',    name: 'Personal',    color: 'emerald' },
  { id: 'trabajo',     name: 'Trabajo',     color: 'amber'   },
]

export function useTaskFlow(user: User) {
  const [tasks,      setTasks]      = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [settings,   setSettings]   = useState<Settings>({ darkMode: true, currentSort: 'manual' })
  const [loading,    setLoading]    = useState(true)

  // ─── Path helpers ─────────────────────────────────────────────────────────
  const tasksCol    = () => collection(db, 'users', user.uid, 'tasks')
  const catsCol     = () => collection(db, 'users', user.uid, 'categories')
  const settingsDoc = () => doc(db, 'users', user.uid, 'settings', 'app')
  const taskDoc     = (id: string) => doc(db, 'users', user.uid, 'tasks', id)

  // ─── Load data ────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const [taskSnap, catSnap, settingSnap] = await Promise.all([
          getDocs(query(tasksCol(), orderBy('order'))),
          getDocs(catsCol()),
          getDoc(settingsDoc()),
        ])

        if (cancelled) return

        const loadedTasks = taskSnap.docs.map(d => ({ id: d.id, ...d.data() } as Task))
        let loadedCats    = catSnap.docs.map(d => ({ id: d.id, ...d.data() } as Category))

        if (loadedCats.length === 0) {
          const batch = writeBatch(db)
          DEFAULT_CATEGORIES.forEach(cat => {
            batch.set(doc(db, 'users', user.uid, 'categories', cat.id), { name: cat.name, color: cat.color })
          })
          await batch.commit()
          loadedCats = [...DEFAULT_CATEGORIES]
        }

        let loadedSettings: Settings = { darkMode: true, currentSort: 'manual' }
        if (settingSnap.exists()) {
          loadedSettings = settingSnap.data() as Settings
        } else {
          await setDoc(settingsDoc(), loadedSettings)
        }

        setTasks(loadedTasks)
        setCategories(loadedCats)
        setSettings(loadedSettings)
      } catch {
        setTasks([])
        setCategories([...DEFAULT_CATEGORIES])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [user.uid])

  // ─── Tasks CRUD ───────────────────────────────────────────────────────────
  const createTask = useCallback(async (payload: Omit<Task, 'id' | 'createdAt' | 'completed' | 'order'>) => {
    const newTask = {
      ...payload,
      completed: false,
      order: tasks.length,
      createdAt: new Date().toISOString(),
    }
    const ref = await addDoc(tasksCol(), newTask)
    setTasks(prev => [...prev, { id: ref.id, ...newTask }])
  }, [tasks.length, user.uid])

  const updateTask = useCallback(async (id: string, payload: Partial<Task>) => {
    await updateDoc(taskDoc(id), payload as Record<string, unknown>)
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...payload } : t))
  }, [user.uid])

  const deleteTask = useCallback(async (id: string) => {
    await deleteDoc(taskDoc(id))
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [user.uid])

  const reorderTasks = useCallback(async (reordered: Task[]) => {
    setTasks(reordered)
    const batch = writeBatch(db)
    reordered.forEach((t, i) => batch.update(taskDoc(t.id), { order: i }))
    await batch.commit()
  }, [user.uid])

  const toggleComplete = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    const completed = !task.completed
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed } : t))
    try {
      await updateDoc(taskDoc(id), { completed })
    } catch {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t))
    }
  }, [tasks, user.uid])

  // ─── Categories CRUD ──────────────────────────────────────────────────────
  const createCategory = useCallback(async (name: string, color: string) => {
    const ref = await addDoc(catsCol(), { name, color })
    const cat: Category = { id: ref.id, name, color }
    setCategories(prev => [...prev, cat])
    return cat
  }, [user.uid])

  // ─── Settings ─────────────────────────────────────────────────────────────
  const saveSettings = useCallback(async (patch: Partial<Settings>) => {
    const updated = { ...settings, ...patch }
    setSettings(updated)
    await setDoc(settingsDoc(), updated, { merge: true })
  }, [settings, user.uid])

  return {
    tasks, categories, settings, loading,
    createTask, updateTask, deleteTask, reorderTasks, toggleComplete,
    createCategory, saveSettings,
  }
}

export type TaskFlowActions = ReturnType<typeof useTaskFlow>
