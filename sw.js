/* Wales Coast Path Tracker — service worker
   Makes the app itself work offline (map tiles fill in when signal returns,
   and recently-viewed tiles are cached too). */

const SHELL_CACHE = 'wcp-shell-v1';
const TILE_CACHE  = 'wcp-tiles-v1';
const TILE_LIMIT  = 400; // max cached map tiles (roughly a few MB)

const SHELL_URLS = [
  './',
  './index.html',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => Promise.allSettled(SHELL_URLS.map(u => cache.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== SHELL_CACHE && k !== TILE_CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

async function trimTileCache() {
  const cache = await caches.open(TILE_CACHE);
  const keys = await cache.keys();
  if (keys.length > TILE_LIMIT) {
    // delete oldest entries (keys() preserves insertion order)
    const excess = keys.length - TILE_LIMIT;
    for (let i = 0; i < excess; i++) await cache.delete(keys[i]);
  }
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;

  // Map tiles: cache-first, then network (and store), capped
  if (url.hostname.endsWith('tile.openstreetmap.org')) {
    event.respondWith(
      caches.open(TILE_CACHE).then(cache =>
        cache.match(event.request).then(hit => {
          if (hit) return hit;
          return fetch(event.request).then(res => {
            if (res && res.ok) {
              cache.put(event.request, res.clone());
              trimTileCache();
            }
            return res;
          });
        })
      )
    );
    return;
  }

  // Analytics + external APIs: network only, never cached
  if (url.hostname.includes('goatcounter') || url.hostname.includes('open-meteo')) return;

  // App shell / Leaflet: network-first so updates land, cache fallback for offline
  if (url.origin === self.location.origin || url.hostname === 'unpkg.com') {
    event.respondWith(
      fetch(event.request).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then(c => c.put(event.request, copy));
        }
        return res;
      }).catch(() =>
        caches.match(event.request).then(hit => hit || caches.match('./index.html'))
      )
    );
  }
});
