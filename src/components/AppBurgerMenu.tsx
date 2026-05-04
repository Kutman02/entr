import { NavLink } from 'react-router-dom'
import {
  FiArrowRight,
  FiBook,
  FiBookOpen,
  FiDownload,
  FiMessageCircle,
  FiX,
  FiZap,
} from 'react-icons/fi'
import type { IconType } from 'react-icons'
import {
  APP_INFO,
  type AppMode,
  type AppNavigationItem,
} from '../constants/navigation'
import Button from './ui/Button'

interface AppBurgerMenuProps {
  items: AppNavigationItem[]
  activeMode: AppMode
  onNavigate: () => void
  onClose: () => void
  canInstall: boolean
  onInstall: () => void
}

const modeIcons: Record<AppMode, IconType> = {
  learn: FiBookOpen,
  practice: FiZap,
  simulation: FiMessageCircle,
  vocabulary: FiBook,
}

export default function AppBurgerMenu({
  items,
  activeMode,
  onNavigate,
  onClose,
  canInstall,
  onInstall,
}: AppBurgerMenuProps) {
  const activeItem = items.find((item) => item.mode === activeMode)
  const ActiveModeIcon = modeIcons[activeMode]
  const learnDescription =
    items.find((item) => item.mode === 'learn')?.description ??
    activeItem?.description ??
    ''

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Меню приложения"
    >
      <button
        type="button"
        className="menu-overlay absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Закрыть меню"
      />

      <aside className="menu-drawer absolute right-0 top-0 z-10 flex h-full w-[min(88vw,22rem)] flex-col border-l border-slate-200 bg-slate-50/95 shadow-2xl backdrop-blur-md">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-3xl font-extrabold text-slate-800">Меню</h2>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
            aria-label="Закрыть меню"
          >
            <FiX className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <section>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
              Текущий режим
            </p>

            <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50/80 p-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                  <ActiveModeIcon className="h-5 w-5" aria-hidden="true" />
                </span>

                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-slate-800">
                    {activeItem?.label ?? 'Режим'}
                  </p>
                  <p className="readable-copy mt-1 text-sm text-slate-600">
                    {activeItem?.description ?? learnDescription}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 border-t border-slate-200 pt-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
              Мои данные
            </p>

            <div className="mt-3 rounded-2xl bg-slate-100 p-4">
              <p className="font-semibold text-slate-700">Локальное сохранение включено</p>
              <p className="mt-1 text-sm text-slate-600">
                Прогресс и настройки сохраняются автоматически на этом устройстве.
              </p>
            </div>
          </section>

          <section className="mt-6 border-t border-slate-200 pt-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
              Разделы
            </p>

            <nav className="mt-3 flex flex-col gap-3" aria-label="Основная навигация">
              {items.map((item) => {
                const isActive = item.mode === activeMode
                const ItemIcon = modeIcons[item.mode]

                return (
                  <NavLink
                    key={item.mode}
                    to={item.path}
                    onClick={onNavigate}
                    className={`rounded-2xl border px-3 py-3 transition ${
                      isActive
                        ? 'border-cyan-200 bg-cyan-50'
                        : 'border-slate-200 bg-white/80 hover:border-cyan-200 hover:bg-cyan-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          isActive
                            ? 'bg-cyan-600 text-white'
                            : 'bg-cyan-100 text-cyan-700'
                        }`}
                      >
                        <ItemIcon className="h-4 w-4" aria-hidden="true" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-bold text-slate-800">
                          {item.label}
                        </p>
                        <p className="readable-copy mt-0.5 text-sm text-slate-600">
                          {item.description}
                        </p>
                      </div>

                      <FiArrowRight className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                    </div>
                  </NavLink>
                )
              })}
            </nav>
          </section>

          <section className="mt-6 border-t border-slate-200 pt-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
              О приложении
            </p>

            <div className="mt-3 rounded-2xl bg-slate-100 p-4">
              <p className="font-semibold text-slate-700">{APP_INFO.badge}</p>
              <p className="readable-copy mt-1 text-sm text-slate-600">{APP_INFO.description}</p>
              <p className="mt-2 text-xs font-medium text-slate-500">Версия: 1.0.0</p>
            </div>

            <Button
              onClick={onInstall}
              tone="soft"
              size="sm"
              disabled={!canInstall}
              className="mt-3 w-full justify-center"
              aria-label="Установить приложение"
            >
              <FiDownload className="h-4 w-4" aria-hidden="true" />
              Установить
            </Button>
          </section>
        </div>
      </aside>
    </div>
  )
}
