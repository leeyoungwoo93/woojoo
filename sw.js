// 우주부부 알림 (영우 폰이 보낸 웹 푸시를 띄운다)
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || '우주부부', {
    body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png', data: { open: d.open || 'chat' }
  }));
});

// 알림을 누르면: 열려 있으면 그 화면에서 채팅을 열고, 아니면 새로 연다
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var open = (e.notification.data || {}).open || 'chat';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (cs) {
    if (cs.length) { cs[0].postMessage({ t: 'open', open: open }); return cs[0].focus(); }
    return self.clients.openWindow('./?open=' + open);
  }));
});
