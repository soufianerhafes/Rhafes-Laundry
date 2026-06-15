self.addEventListener('install', e => self.skipWaiting());

self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || '🫧 Rhafes Laundry';
  const options = {
    body: data.body || 'Laundry update',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🫧</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🫧</text></svg>',
    tag: data.tag || 'rhafes-laundry',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: { url: data.url || self.location.origin }
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || self.location.origin;
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cls => {
    for (const c of cls) { if (c.url.startsWith(self.location.origin) && 'focus' in c) return c.focus(); }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SHOW_NOTIF') {
    const { title, body, tag } = e.data;
    self.registration.showNotification(title, {
      body, tag: tag || 'rhafes-notif',
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🫧</text></svg>',
      requireInteraction: true,
      vibrate: [200, 100, 200],
      data: { url: self.location.origin }
    });
  }
});
