import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { FiDownload, FiMenu, FiX } from 'react-icons/fi'
import AppBurgerMenu from '../components/AppBurgerMenu'
import {
  APP_INFO,
  APP_NAV_ITEMS,
  DEFAULT_APP_MODE,
  getModeByPath,
  isAppMode,
} from '../constants/navigation'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { useLocalStorageState } from '../hooks/useLocalStorageState'
import { usePwaInstallPrompt } from '../hooks/usePwaInstallPrompt'

export default function AppLayout() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { canInstall, install } = usePwaInstallPrompt()
  const [storedMode, setStoredMode] = useLocalStorageState(
    STORAGE_KEYS.appMode,
    DEFAULT_APP_MODE,
    { validate: isAppMode },
  )

  const activeMode = useMemo(() => {
    return getModeByPath(location.pathname)
  }, [location.pathname])

  const activeItem = useMemo(() => {
    return APP_NAV_ITEMS.find((item) => item.mode === activeMode)
  }, [activeMode])

  useEffect(() => {
    if (storedMode !== activeMode) {
      setStoredMode(activeMode)
    }
  }, [activeMode, setStoredMode, storedMode])

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <header className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-sm sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
              {APP_INFO.badge}
            </p>

            <div className="flex items-center gap-2">
              {canInstall ? (
                <button
                  type="button"
                  onClick={() => {
                    install().catch(() => {
                      return undefined
                    })
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-100"
                  aria-label="Install app"
                >
                  <FiDownload className="h-4 w-4" aria-hidden="true" />
                  Install
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => setIsMenuOpen((previousState) => !previousState)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? (
                  <FiX className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <FiMenu className="h-4 w-4" aria-hidden="true" />
                )}
                Menu
              </button>
            </div>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            {APP_INFO.heading}
          </h1>

          <p className="mt-2 max-w-2xl text-base text-slate-600 sm:text-lg">
            {APP_INFO.description}
          </p>

          <p className="mt-4 text-sm text-slate-500">{activeItem?.description}</p>
        </header>

        {isMenuOpen ? (
          <AppBurgerMenu
            items={APP_NAV_ITEMS}
            activeMode={activeMode}
            onNavigate={() => setIsMenuOpen(false)}
          />
        ) : null}

        <section className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-sm sm:p-6">
          <Outlet />
        </section>
      </div>
    </main>
  )
}
