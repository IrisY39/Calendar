const CACHE_NAME = "calendar-pwa-v5";
const ASSETS = [
  "./index.html",
  "./styles.css",
  "./app.js",
  "./messages.json",
  "./manifest.json",
  "./assets/icon-192.png?v=2",
  "./assets/icon-512.png?v=2",
  "./assets/apple-touch-icon.png?v=2"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

