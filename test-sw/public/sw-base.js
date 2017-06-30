// code in service worker file
var CACHE_NAME = 'pwa-cache-v1';
var urlsToCache = [ 
    '/',  
    '/lib/jquery-1.12.4.min.js',  
    '/css/index.css',
    '/js/index.js'
];

self.addEventListener('install', function(event) {  // Perform install steps     
    event.waitUntil(   
        caches.open(CACHE_NAME)     
        .then(function(cache) {       
            console.log('Opened cache');       
            return cache.addAll(urlsToCache);     
        }).then(() => self.skipWaiting())
    );
});

// 1.没有命中缓存则从网络获取
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

// 2.没有命中缓存则从网络获取，并缓存到本地
// this.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request).then(function(resp) {
//       return resp || fetch(event.request).then(function(response) {
//         return caches.open(CACHE_NAME).then(function(cache) {
//           cache.put(event.request, response.clone());
//           return response;
//         });  
//       });
//     })
//   );
// });

// 3.没有命中缓存则从网络获取，并缓存到本地，失败则返回默认信息
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request).then(function(resp) {
//       return resp || fetch(event.request).then(function(response) {
//         caches.open(CACHE_NAME).then(function(cache) {
//           cache.put(event.request, response.clone());
//         });
//         return response;
//       });
//     }).catch(function() {
//       return caches.match('/sw-test/gallery/myLittleVader.jpg');
//     })
//   );
// });