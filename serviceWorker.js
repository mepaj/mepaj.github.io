const setAssets = [
    './',
    './style.css',
    './app.js',
    './serviceWorker.js'
]

self.addEventListener('install', async e => {
    // console.log('install 55');
    const cache = await caches.open('news-static');
    cache.addAll(setAssets);
});

self.addEventListener('fetch', e => {
    const req = e.request;
    const url = new URL(req.url);

    console.log('url.origin === location.origin >>>>>> ', url.origin, location.origin);
    if (url.origin === location.origin) {
        e.respondWith(cacheFirst(req));
    } else {
        e.respondWith(networkFirst(req));
    }
});

async function cacheFirst(req) {
    const cacheResponse = await caches.match(req);
    return cacheResponse || fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open('news-dynamic');

    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (error) {
        return await cache.match(req);
    }
}
