// public/sw.js

self.addEventListener("push", function (event) {
  const data = event.data?.json() || {};

  const title = data.title || "New Notification";
  const options = {
    body: data.body || "You have a new message.",
    icon: "/icon-192x192.png", // optional
    badge: "/badge-icon.png", // optional
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/") // or your preferred route
  );
});
