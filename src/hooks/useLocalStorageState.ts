import { useEffect, useState } from 'react'

type InitialValue<T> = T | (() => T)
type ValidateFn<T> = (value: unknown) => value is T

interface UseLocalStorageStateOptions<T> {
  validate?: ValidateFn<T>
}

const getInitialValue = <T,>(initialValue: InitialValue<T>): T => {
  return typeof initialValue === 'function'
    ? (initialValue as () => T)()
    : initialValue
}

export const useLocalStorageState = <T,>(
  key: string,
  initialValue: InitialValue<T>,
  options: UseLocalStorageStateOptions<T> = {},
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

      const parsedValue = JSON.parse(stored) as unknown

      if (options.validate && !options.validate(parsedValue)) {
        window.localStorage.removeItem(key)
        return fallbackValue
      }

      return parsedValue as T
    } catch {
      try {
        window.localStorage.removeItem(key)
      } catch {
        // Ignore remove failures.
      }

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
