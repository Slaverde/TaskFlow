import { useState } from 'react'
import { Task } from '@/types'
import { MONTHS } from '@/lib/utils'

interface Props {
  tasks: Task[]
  selectedDate: string | null
  onDateSelect: (date: string | null) => void
}

export default function CalendarWidget({ tasks, selectedDate, onDateSelect }: Props) {
  const [calMonth, setCalMonth] = useState(new Date())

  const year     = calMonth.getFullYear()
  const month    = calMonth.getMonth()
  const first    = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startPad = (first.getDay() + 6) % 7
  const today    = new Date()

  const dayNames = ['L','M','X','J','V','S','D']

  return (
    <aside className="lg:w-[30%] border-t lg:border-t-0 lg:border-l border-border p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm">{MONTHS[month]} {year}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setCalMonth(d => { const n = new Date(d); n.setMonth(n.getMonth()-1); return n })}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-secondary hover:text-primary"
            aria-label="Mes anterior"
          >‹</button>
          <button
            onClick={() => setCalMonth(d => { const n = new Date(d); n.setMonth(n.getMonth()+1); return n })}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-secondary hover:text-primary"
            aria-label="Mes siguiente"
          >›</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {dayNames.map(d => (
          <span key={d} className="text-secondary text-xs py-1">{d}</span>
        ))}
        {Array.from({ length: startPad }).map((_, i) => (
          <span key={`pad-${i}`} className="cal-day py-1.5" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = i + 1
          const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
          const dayTasks = tasks.filter(t => t.dueDate === dateStr && !t.completed)
          const maxPri = dayTasks.some(t => t.priority === 'high') ? 'high'
            : dayTasks.some(t => t.priority === 'medium') ? 'medium'
            : dayTasks.length ? 'low' : ''
          const isToday    = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d
          const isSelected = selectedDate === dateStr

          const cls = [
            'cal-day py-1.5 rounded-lg cursor-pointer hover:bg-white/5 text-xs',
            isToday    ? 'today'    : '',
            isSelected ? 'selected' : '',
            maxPri     ? `has-tasks priority-${maxPri}` : '',
          ].filter(Boolean).join(' ')

          return (
            <span
              key={d}
              className={cls}
              onClick={() => onDateSelect(selectedDate === dateStr ? null : dateStr)}
            >
              {d}
            </span>
          )
        })}
      </div>
    </aside>
  )
}
