import { View, Filter, SortOrder } from '@/types'
import { formatFullDate } from '@/lib/utils'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { TubelightNavBar } from '@/components/ui/tubelight-navbar'
import { Plus } from 'lucide-react'

interface Props {
  currentView: View
  search: string
  currentFilter: Filter
  currentSort: SortOrder
  darkMode: boolean
  onSearchChange: (q: string) => void
  onFilterChange: (f: Filter) => void
  onSortChange: (s: SortOrder) => void
  onDarkModeToggle: () => void
  onNewTask: () => void
  onMenuToggle: () => void
}

const VIEW_TITLE: Record<View, string | (() => string)> = {
  hoy:        () => `Hoy · ${formatFullDate(new Date())}`,
  proximos:   'Próximos 7 días',
  todas:      'Todas las tareas',
  calendario: 'Calendario',
  completadas:'Completadas',
}

type FilterValue = NonNullable<Filter>

const FILTER_ITEMS: { id: FilterValue; label: string }[] = [
  { id: 'activas',   label: 'Activas'        },
  { id: 'alta',      label: 'Alta prioridad' },
  { id: 'con-fecha', label: 'Con fecha'      },
]

export default function Header({
  currentView, search, currentFilter, currentSort, darkMode,
  onSearchChange, onFilterChange, onSortChange, onDarkModeToggle, onNewTask, onMenuToggle,
}: Props) {
  const title = VIEW_TITLE[currentView]
  const titleStr = typeof title === 'function' ? title() : title

  return (
    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-border px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          id="menu-toggle"
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <h2 className="text-xl font-semibold flex-1">{titleStr}</h2>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Buscar..."
              className="w-36 sm:w-56 px-4 py-2 rounded-lg bg-surface-card border border-border text-sm placeholder-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 shadow-sm"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>

          {/* Filtros con estilo tubelight */}
          <TubelightNavBar<FilterValue>
            items={FILTER_ITEMS}
            activeId={currentFilter as FilterValue | null}
            onSelect={f => onFilterChange(f as Filter)}
            className="flex-shrink-0"
          />

          {/* Sort */}
          <select
            value={currentSort}
            onChange={e => onSortChange(e.target.value as SortOrder)}
            className="px-3 py-1.5 rounded-lg bg-surface-card border border-border text-xs text-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer"
          >
            <option value="manual">Orden manual</option>
            <option value="priority">Por prioridad</option>
            <option value="date">Por fecha</option>
            <option value="created">Más reciente</option>
          </select>

          {/* Dark mode */}
          <button
            onClick={onDarkModeToggle}
            title="Alternar modo oscuro/claro"
            className="p-2 rounded-lg bg-white/5 border border-border hover:bg-white/10 transition-colors"
          >
            {darkMode ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            )}
          </button>

          <InteractiveHoverButton
            text="Nueva tarea"
            icon={<Plus size={16} />}
            onClick={onNewTask}
            className="border-accent/60 bg-accent/10 text-primary text-sm [&_.absolute]:bg-accent"
          />
        </div>
      </div>
    </header>
  )
}
