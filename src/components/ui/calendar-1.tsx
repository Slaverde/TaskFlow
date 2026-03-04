'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'

const CalendarDemo = ({ selected, onSelect }: { selected?: Date, onSelect?: (date: Date | undefined) => void }) => {
  const [date, setDate] = useState<Date | undefined>(selected || new Date())

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    if (onSelect) onSelect(newDate)
  }

  return (
    <div className="flex flex-col items-center">
      <Calendar 
        mode='single' 
        defaultMonth={date} 
        selected={date} 
        onSelect={handleSelect} 
        className='rounded-lg border bg-surface-card/50 backdrop-blur-sm' 
      />
      <p className='text-secondary mt-3 text-center text-xs' role='region'>
        Selecciona una fecha para filtrar tareas
      </p>
    </div>
  )
}

export default CalendarDemo
