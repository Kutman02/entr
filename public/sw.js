const APP_NAMESPACE = 'waiter-trainer'
const BUILD_VERSION = new URL(self.location.href).searchParams.get('v') || 'dev'
const STATIC_CACHE = `${APP_NAMESPACE}-static-${BUILD_VERSION}`
const RUNTIME_CACHE = `${APP_NAMESPACE}-runtime-${BUILD_VERSION}`

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/pwa-192.png',
  '/pwa-512.png',
  '/apple-touch-icon.png',
]

self.addEventListener('install', (event) => {
  self.skipWaiting()

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => {
        return undefined
      }),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        const staleCaches = cacheNames.filter((cacheName) => {
          if (!cacheName.startsWith(`${APP_NAMESPACE}-`)) {
            return false
          }

          return cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE
        })

        return Promise.all(staleCaches.map((cacheName) => caches.delete(cacheName)))
      })
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

const isSameOrigin = (request) => {
  const requestUrl = new URL(request.url)
  return requestUrl.origin === self.location.origin
}

const cacheResponse = async (cacheName, request, response) => {
  if (!response || response.status !== 200 || response.type === 'opaque') {
    return
  }

  const cache = await caches.open(cacheName)
  await cache.put(request, response.clone())
}

const networkFirstForNavigation = async (request) => {
  try {
    const networkResponse = await fetch(request)
    await cacheResponse(RUNTIME_CACHE, request, networkResponse)
    return networkResponse
  } catch {
    const cachedPage = await caches.match(request)

    if (cachedPage) {
      return cachedPage
    }

    const fallbackIndex = await caches.match('/index.html')

    if (fallbackIndex) {
      return fallbackIndex
    }

    return new Response('Offline', {
      status: 503,
      statusText: 'Offline',
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}

const staleWhileRevalidate = async (request) => {
  const cachedResponse = await caches.match(request)
  const fetchPromise = fetch(request)
    .then(async (networkResponse) => {
      await cacheResponse(RUNTIME_CACHE, request, networkResponse)
      return networkResponse
    })
    .catch(() => {
      return undefined
    })

  if (cachedResponse) {
    return cachedResponse
  }

  const networkResponse = await fetchPromise

  if (networkResponse) {
    return networkResponse
  }

  return new Response('', { status: 504, statusText: 'Gateway Timeout' })
}

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  if (!isSameOrigin(request)) {
    return
  }

  const requestUrl = new URL(request.url)

  if (requestUrl.pathname.startsWith('/api/')) {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstForNavigation(request))
    return
  }

  const isStaticAsset = /\.(?:js|mjs|css|png|jpg|jpeg|svg|webp|ico|woff2?|json)$/i.test(
    requestUrl.pathname,
  )

  if (isStaticAsset) {
    event.respondWith(staleWhileRevalidate(request))
  }
})
