/* Nawiri Pamoja service worker: makes the app work offline.
   VERSION and AUDIO are set automatically by the deploy workflow
   (.github/workflows/deploy.yml). Edit them by hand only when uploading manually:
   - VERSION: change whenever index.html (or other app files) change
   - AUDIO:   change whenever recordings in audio/ change */
const VERSION = 'np-v2';
const AUDIO = 'np-audio-v1';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'audio/manifest.json'];
const isVoice = url => /\/audio\/(luo|en)\//.test(url.pathname);

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const app = await caches.open(VERSION);
    await app.addAll(SHELL);
    // Download all hosted voice files now, so they work offline. Only files missing
    // from the audio cache are fetched; a failed file never blocks the installation.
    try {
      const m = await (await fetch('audio/manifest.json', {cache: 'no-store'})).json();
      const urls = [];
      for (const l of ['luo', 'en']) for (const [id, ext] of Object.entries(m[l] || {})) urls.push('audio/' + l + '/' + id + '.' + ext);
      const ac = await caches.open(AUDIO);
      for (let i = 0; i < urls.length; i += 8) {
        await Promise.all(urls.slice(i, i + 8).map(async u => { try { if (!(await ac.match(u))) await ac.add(u); } catch (err) {} }));
      }
    } catch (err) {}
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== AUDIO).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const store = (name, res) => { if (res && res.ok) { const copy = res.clone(); caches.open(name).then(c => c.put(req, copy)); } return res; };
  // voice files: cache first (they rarely change)
  if (isVoice(url)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => store(AUDIO, res))));
    return;
  }
  // everything else: show the cached copy immediately, refresh it in the background
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      const net = fetch(req).then(res => store(VERSION, res)).catch(() => hit);
      return hit || net;
    })
  );
});
