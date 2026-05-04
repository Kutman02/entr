import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import AppBurgerMenu from '../components/AppBurgerMenu'
import Button from '../components/ui/Button'
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

  useEffect(() => {
    if (storedMode !== activeMode) {
      setStoredMode(activeMode)
    }
  }, [activeMode, setStoredMode, storedMode])

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  return (
    <main className="min-h-screen px-3 py-4 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <header className="glass-panel sticky top-3 z-40 rounded-3xl p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
              {APP_INFO.badge}
            </p>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsMenuOpen((previousState) => !previousState)}
                tone="secondary"
                size="icon"
                aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                title={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
              >
                {isMenuOpen ? (
                  <FiX className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <FiMenu className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {isMenuOpen ? (
          <AppBurgerMenu
            items={APP_NAV_ITEMS}
            activeMode={activeMode}
            onNavigate={() => setIsMenuOpen(false)}
            onClose={() => setIsMenuOpen(false)}
            canInstall={canInstall}
            onInstall={() => {
              if (!canInstall) {
                return
              }

              install().catch(() => {
                return undefined
              })
            }}
          />
        ) : null}

        <section className="glass-panel rounded-3xl p-4 sm:p-6">
          <Outlet />
        </section>
      </div>
    </main>
  )
}
