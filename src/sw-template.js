if ('function' === typeof importScripts) {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded');

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([]);

    /* custom cache rules*/
    /* workbox.routing.registerNavigationRoute('/index.html', {
      blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/],
    }); */

    workbox.routing.registerRoute(
      /\.(?:png|gif|jpg|jpeg)$/,
      new workbox.strategies.CacheFirst({
        cacheName: 'images',
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          }),
        ],
      })
    );

  } else {
    console.log('Workbox could not be loaded. No Offline support');
  }
}

workbox.routing.registerRoute(
  new RegExp('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/.*', 'g'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 1000,
        maxAgeSeconds: 365 * 24 * 60 * 60
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp('https://api.luftdaten.info/v1/sensor/.*', 'g'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 1000,
        maxAgeSeconds: 3 * 60
      })
    ]
  })
);

/**
 * PUSH PUSH
 */

self.addEventListener('push', event => {
  const data = event.data.json();

  var options = {
    title: data.title,
    body: data.body,
    tag: data.data.tag,
    icon: data.icon,
    data: {
      url: data.data.url
    }
    /* actions: [
      {
        action: 'explore', title: 'Explore this new world',
        icon: 'images/checkmark.png'
      },
      {
        action: 'close', title: 'Close',
        icon: 'images/xmark.png'
      },
    ] */
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
})

self.addEventListener('notificationclick', function(event) {
  const clickedNotification = event.notification;
  clickedNotification.close();

  // Do something as the result of the notification click
  const doSomething = (event) => {
    clients.openWindow(event.notification.data.url)
  }

  const promiseChain = doSomething(event);
  event.waitUntil(promiseChain);
});
