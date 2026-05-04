export type AppMode = 'learn' | 'practice' | 'simulation'

export interface AppNavigationItem {
  mode: AppMode
  label: string
  path: string
  description: string
}

export const DEFAULT_APP_MODE: AppMode = 'practice'

export const APP_INFO = {
  badge: 'Hotel Waiter Language Trainer',
  heading: 'English to Turkish Service Drill',
  description:
    'Focus on speed, clarity, and real guest situations in an all-inclusive restaurant.',
}

export const APP_NAV_ITEMS: AppNavigationItem[] = [
  {
    mode: 'learn',
    label: 'Learn',
    path: '/learn',
    description: 'Review all phrases by scenario and difficulty level.',
  },
  {
    mode: 'practice',
    label: 'Practice',
    path: '/practice',
    description: 'Main drill: react in 2-3 seconds before answers are shown.',
  },
  {
    mode: 'simulation',
    label: 'Simulation',
    path: '/simulation',
    description: 'Run through short multi-step hotel service dialogues.',
  },
]

export const getModeByPath = (pathname: string): AppMode => {
  const match = APP_NAV_ITEMS.find((item) => pathname.startsWith(item.path))
  return match?.mode ?? DEFAULT_APP_MODE
}

export const getPathByMode = (mode: AppMode): string => {
  return APP_NAV_ITEMS.find((item) => item.mode === mode)?.path ?? '/practice'
}
