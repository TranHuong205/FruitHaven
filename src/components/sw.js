const CACHE_NAME = 'fruit-haven-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest'
];

// Cài đặt Service Worker và lưu trữ các tài nguyên tĩnh core
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Kích hoạt và dọn dẹp các phiên bản cache cũ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Xử lý yêu cầu mạng: Ưu tiên cache trước để đảm bảo tốc độ và offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Lưu tự động các tài nguyên (ảnh, script) khi duyệt web
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // Khi offline hoàn toàn, fallback về '/' đã cache
        return caches.match('/');
      });
    })
  );
});

// Lắng nghe sự kiện Push từ Server
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { 
    title: 'Cập nhật từ Fruit Haven', 
    body: 'Đơn hàng của bạn vừa có thay đổi trạng thái mới.' 
  };

  const options = {
    body: data.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/3194/3194591.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/3194/3194591.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/profile'
    }
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Xử lý khi người dùng nhấn vào thông báo
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
