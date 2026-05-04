import { useId, type ReactNode } from 'react'
import { FiChevronDown, FiChevronUp, FiSliders } from 'react-icons/fi'
import { useLocalStorageState } from '../hooks/useLocalStorageState'
import Button from './ui/Button'

interface CollapsibleFiltersProps {
  storageKey: string
  summary: string
  children: ReactNode
  title?: string
  defaultOpen?: boolean
}

const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean'
}

export default function CollapsibleFilters({
  storageKey,
  summary,
  children,
  title = 'Фильтры',
  defaultOpen = false,
}: CollapsibleFiltersProps) {
  const [isOpen, setIsOpen] = useLocalStorageState<boolean>(
    storageKey,
    defaultOpen,
    { validate: isBoolean },
  )
  const contentId = useId()

  return (
    <section className="glass-card rounded-2xl p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            <FiSliders className="h-4 w-4" aria-hidden="true" />
            {title}
          </p>
          <p className="readable-copy mt-1 text-xs text-slate-600 sm:text-sm">
            {summary}
          </p>
        </div>

        <Button
          onClick={() => setIsOpen((previousState) => !previousState)}
          tone="secondary"
          size="sm"
          aria-expanded={isOpen}
          aria-controls={contentId}
        >
          {isOpen ? 'Скрыть' : 'Показать'}
          {isOpen ? (
            <FiChevronUp className="h-4 w-4" aria-hidden="true" />
          ) : (
            <FiChevronDown className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>

      {isOpen ? (
        <div id={contentId} className="mt-4 space-y-4">
          {children}
        </div>
      ) : null}
    </section>
  )
}