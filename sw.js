const C = 'othello-v4';
const fresh = u => new Request(u, { cache: 'reload' });
self.addEventListener('install', e => e.waitUntil(caches.open(C).then(c => c.addAll([fresh('./'), fresh('./index.html')])).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.map(n => n === C ? null : caches.delete(n)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(fresh('./index.html')).then(r => { if (r.ok) caches.open(C).then(c => c.put('./index.html', r.clone())); return r; }).catch(() => caches.match('./index.html')));
  } else {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});
