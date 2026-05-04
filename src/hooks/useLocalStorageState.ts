import { useEffect, useState } from 'react'

type InitialValue<T> = T | (() => T)

const getInitialValue = <T,>(initialValue: InitialValue<T>): T => {
  return typeof initialValue === 'function'
    ? (initialValue as () => T)()
    : initialValue
}

export const useLocalStorageState = <T,>(
  key: string,
  initialValue: InitialValue<T>,
) => {
  const [value, setValue] = useState<T>(() => {
    const fallbackValue = getInitialValue(initialValue)

    if (typeof window === 'undefined') {
      return fallbackValue
    }

    try {
      const stored = window.localStorage.getItem(key)

      if (stored === null) {
        return fallbackValue
      }

      return JSON.parse(stored) as T
    } catch {
      return fallbackValue
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore write failures (private mode or quota exceeded).
    }
  }, [key, value])

  return [value, setValue] as const
}
