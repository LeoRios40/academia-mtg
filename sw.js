// Academia do Planeswalker: funciona sem internet depois da primeira visita.
const VERSAO = 'academia-v2';
const ARQUIVOS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO && k !== 'cartas').map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // páginas e arquivos da Academia: tenta a internet primeiro (pega atualizações), senão usa a cópia salva
  if (u.origin === location.origin) {
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(VERSAO).then(ca => ca.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
    return;
  }
  // imagens das cartas e fontes: usa a cópia salva quando existir
  if (u.hostname === 'cards.scryfall.io' || u.hostname.endsWith('gstatic.com') || u.hostname === 'fonts.googleapis.com' || u.hostname === 'svgs.scryfall.io') {
    e.respondWith(caches.open('cartas').then(ca => ca.match(e.request).then(hit => hit || fetch(e.request).then(r => { ca.put(e.request, r.clone()); return r; }))));
  }
});
