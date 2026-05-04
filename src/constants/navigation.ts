export type AppMode = 'learn' | 'practice' | 'simulation'

export interface AppNavigationItem {
  mode: AppMode
  label: string
  path: string
  description: string
}

export const DEFAULT_APP_MODE: AppMode = 'practice'

export const APP_INFO = {
  badge: 'Тренажёр официанта',
  heading: 'English -> Turkish: сервисные диалоги',
  description:
    'Тренируйте скорость, чёткость и реальные ситуации с гостями в формате быстрых повторений.',
}

export const APP_NAV_ITEMS: AppNavigationItem[] = [
  {
    mode: 'learn',
    label: 'Изучение',
    path: '/learn',
    description: 'Просмотр всех фраз по сценариям и уровням сложности.',
  },
  {
    mode: 'practice',
    label: 'Практика',
    path: '/practice',
    description: 'Основная тренировка: реакция за 2-3 секунды до показа ответа.',
  },
  {
    mode: 'simulation',
    label: 'Симуляция',
    path: '/simulation',
    description: 'Короткие многошаговые диалоги обслуживания в отеле.',
  },
]

export const getModeByPath = (pathname: string): AppMode => {
  const match = APP_NAV_ITEMS.find((item) => pathname.startsWith(item.path))
  return match?.mode ?? DEFAULT_APP_MODE
}

export const getPathByMode = (mode: AppMode): string => {
  return APP_NAV_ITEMS.find((item) => item.mode === mode)?.path ?? '/practice'
}

export const isAppMode = (value: unknown): value is AppMode => {
  return (
    typeof value === 'string' &&
    APP_NAV_ITEMS.some((item) => item.mode === value)
  )
}
