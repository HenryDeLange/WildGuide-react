const currentCacheName = "v1";
const cachedResources = [
    "/",
    "/index.html"
];

// Pre-cache on install
async function precache() {
    const cache = await caches.open(currentCacheName);
    return cache.addAll(cachedResources);
}

self.addEventListener("install", (event) => {
    console.log('Installing Service Worker');
    event.waitUntil(precache());
});

// Clear old cache on update
self.addEventListener("activate", (event) => {
    console.log('Activating Service Worker');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== currentCacheName) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Cache First on Fetch
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        console.log(`Served from cache: ${request.url}`);
        return cachedResponse;
    }
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(currentCacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }
    catch (error) {
        console.error(error);
        return Response.error();
    }
}

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    if (cachedResources.includes(url.pathname)) {
        event.respondWith(cacheFirst(event.request));
    }
    else {
        event.respondWith(fetch(event.request));
    }
});
