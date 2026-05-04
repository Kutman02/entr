const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000

let didRegister = false

export const registerServiceWorker = () => {
  if (didRegister || typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return
  }

  didRegister = true

  window.addEventListener('load', async () => {
    const swUrl = `/sw.js?v=${encodeURIComponent(__APP_BUILD_ID__)}`

    try {
      const registration = await navigator.serviceWorker.register(swUrl)

      let isRefreshing = false

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (isRefreshing) {
          return
        }

        isRefreshing = true
        window.location.reload()
      })

      const activateWaitingWorker = () => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        }
      }

      activateWaitingWorker()

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing

        if (!newWorker) {
          return
        }

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            activateWaitingWorker()
          }
        })
      })

      window.setInterval(() => {
        registration.update().catch(() => {
          return undefined
        })
      }, UPDATE_CHECK_INTERVAL_MS)
    } catch {
      // Ignore registration failures. The app still works without SW.
    }
  })
}
