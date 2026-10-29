/* =====================================================
   Service Worker — لوحة تحكم تجمع حائل الصحي
   يوفر: التخزين المؤقت، العمل offline، التحديث التلقائي
   ===================================================== */

// ارفع الرقم عند إضافة ملفات أو حذفها حتى تُحذف النسخ القديمة من الأجهزة
const CACHE_VERSION = 12;
const CACHE_NAME = 'hail-health-v' + CACHE_VERSION;

// الملفات الأساسية التي تُخزَّن فوراً عند التثبيت — يكفي فتحها مرة واحدة لتعمل بلا إنترنت
const CORE_FILES = [
  './index.html',
  './manifest.json',
  './logo-white.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './fonts/cairo-arabic.woff2',
  './fonts/cairo-latin.woff2',
  './css/00-fonts.css',
  './css/01-base.css',
  './css/02-home.css',
  './css/03-readiness-check.css',
  './css/04-ops-tetra.css',
  './css/05-hypothesis.css',
  './css/06-hypothesis-sudden.css',
  './css/07-stats-log.css',
  './css/08-splash.css',
  './css/09-theme.css',
  './css/10-refine.css',
  './css/11-pages.css',
  './js/01-home.js',
  './js/02-ops-tetra.js',
  './js/03-hypothesis.js',
  './js/04-hypothesis-pages.js',
  './js/05-hypothesis-sudden.js',
  './js/06-hypothesis-sudden-pages.js',
  './js/07-hypothesis-sudden-photos.js',
  './js/08-core.js',
  './js/09-init.js',
  './js/10-stats-log.js',
  './js/11-app-shell.js',
  './js/12-pwa.js',
  './js/13-archive.js',
  './js/14-validation.js',
  './js/15-a11y.js',
  './js/vendor/html2canvas-1.4.1.min.js'
];

// ── التثبيت: تخزين الملفات الأساسية ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_FILES))
      // تفعيل فوري بدون انتظار إغلاق النوافذ الأخرى
      .then(() => self.skipWaiting())
  );
});

// ── التفعيل: حذف الكاشات القديمة ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))))
      // التحكم في جميع النوافذ المفتوحة فوراً
      .then(() => self.clients.claim())
  );
});

function putInCache(request, response) {
  if (response && response.status === 200 && response.type !== 'opaque') {
    const clone = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
  }
  return response;
}

// ── الاعتراض ──
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith('http')) return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // الصور والخطوط لا تتغير: Cache First
  if (/\.(png|jpe?g|webp|svg|woff2?)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(r => putInCache(request, r)))
    );
    return;
  }

  // الصفحات والأنماط والسكربتات: Network First — يصل آخر تعديل فور توفر الاتصال،
  // وبدون اتصال تُعرض آخر نسخة محفوظة
  event.respondWith(
    fetch(request)
      .then(r => putInCache(request, r))
      .catch(() => caches.match(request, { ignoreSearch: true }).then(cached => {
        if (cached) return cached;
        if (request.mode === 'navigate' || request.destination === 'document') {
          return caches.match('./index.html');
        }
      }))
  );
});

// ── رسائل من الصفحة ──
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();

  // إرجاع إصدار الكاش عند الطلب
  if (event.data === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION, cache: CACHE_NAME });
  }
});
