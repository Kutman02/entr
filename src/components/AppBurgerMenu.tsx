import { NavLink } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import type { AppMode, AppNavigationItem } from '../constants/navigation'

interface AppBurgerMenuProps {
  items: AppNavigationItem[]
  activeMode: AppMode
  onNavigate: () => void
}

export default function AppBurgerMenu({
  items,
  activeMode,
  onNavigate,
}: AppBurgerMenuProps) {
  const activeItem = items.find((item) => item.mode === activeMode)

  return (
    <aside className="rounded-2xl border border-white/70 bg-white/95 p-4 shadow-lg shadow-slate-900/10 backdrop-blur sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Menu
      </p>

      <p className="mt-2 text-sm text-slate-600">
        {activeItem?.description}
      </p>

      <nav className="mt-4 flex flex-col gap-2" aria-label="Main navigation">
        {items.map((item) => {
          const isActive = item.mode === activeMode

          return (
            <NavLink
              key={item.mode}
              to={item.path}
              onClick={onNavigate}
              className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'border-cyan-600 bg-cyan-600 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-400 hover:text-cyan-700'
              }`}
            >
              <span>{item.label}</span>
              <FiArrowRight className="h-4 w-4" aria-hidden="true" />
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
