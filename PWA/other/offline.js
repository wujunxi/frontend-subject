/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */


(function (self) {
  'use strict';

  // On install, cache resources and skip waiting so the worker won't
  // wait for clients to be closed before becoming active.
  self.addEventListener('install', event =>
    event.waitUntil(
      oghliner.cacheResources()
      .then(() => self.skipWaiting())
    )
  );

  // On activation, delete old caches and start controlling the clients
  // without waiting for them to reload.
  self.addEventListener('activate', event =>
    event.waitUntil(
      oghliner.clearOtherCaches()
      .then(() => self.clients.claim())
    )
  );

  // Retrieves the request following oghliner strategy.
  self.addEventListener('fetch', event => {
    if (event.request.method === 'GET') {
      event.respondWith(oghliner.get(event.request));
    } else {
      event.respondWith(self.fetch(event.request));
    }
  });

  var oghliner = self.oghliner = {

    // This is the unique prefix for all the caches controlled by this worker.
    CACHE_PREFIX: 'offline-cache:platform-status:' + (self.registration ? self.registration.scope : '') + ':',

    // This is the unique name for the cache controlled by this version of the worker.
    get CACHE_NAME() {
      return this.CACHE_PREFIX + 'd23a8301da0f00b7c246a9d2ed8eb95e6ecf46a8';
    },

    // This is a list of resources that will be cached.
    RESOURCES: [
      './index.html', // 10c59f73636c56c7cc38ed739503f0577dfd874c
      './bundle.js', // b94c33debd6c047a634b56bdbe2ba140d3291b4c
      './bundle.css', // 31c73e4910981256046257d8eafa0324b6733e92
      './images/anchor.svg', // 6985103fa8f140c061aa2aac858de653fa2b63e4
      './images/browsers/chrome_64x64.png', // 16fb39b2a559cdbe847ceda8323ef48c061c6fdd
      './images/browsers/edge_64x64.png', // 03990abfc47dee90b4e7201981124c10901b7916
      './images/browsers/firefox_64x64.png', // 9d584cf05518a8df1587d5737e99cedbf2f6d1cb
      './images/browsers/firefox-beta_64x64.png', // 0dd4d7bc7f5fee1c71e79c0122d5944ecff7f6fb
      './images/browsers/firefox-developer-edition_64x64.png', // 258dc81a634caefb2cf134d868ba2400ccefa296
      './images/browsers/firefox-nightly_64x64.png', // f1a9bcb4253ca7c43b0fee536e3b4ad4330e1cce
      './images/browsers/opera_64x64.png', // 87d79509665ccd9f5b3c351e9acbe608ffa17c35
      './images/browsers/safari-technology-preview_64x64.png', // fdfbeb8b1a01b0fc2ff4ae7a28c42b91ae040660
      './images/bugzilla.png', // 7269f42f62bfefd436523107e9d793febb847a2d
      './images/bugzilla@2x.png', // 20c03b5250a11cd9b49319f73c09ae3590be3682
      './images/caniuse.png', // eb7df41d92c1862c18ddc26360be495ccbc280c6
      './images/caniuse@2x.png', // 73ecd5a89b2be013137da36211ebf6e158b1b57c
      './images/favicon-192.png', // d891f6fc4fd6cf1583b5ae9d4b82cc5dfaec6b15
      './images/favicon-196.png', // 32d40cdb775cd8314a56b4e0b36778f599ef6e48
      './images/favicon.ico', // 2ae3e4984b57166379fbeb5f913d91946e4b7a39
      './images/firefox.svg', // 277708fc5ad0ecdff4f28f9473ca718c529946ff
      './images/github.png', // 98e1ec309af678d7805ad554604a6d2ec2cdf8de
      './images/github@2x.png', // 641191632cd62f1aa8569e8ed4e257ab820f28dc
      './images/html5.png', // 86c7982cd62f36a04ab35578e983093ee07fa85f
      './images/html5@2x.png', // bcb258002ae0d4b333e6fee384d6ff7e8bfcbe56
      './images/ios-icon-180.png', // 7f66637947169539107bd9c999209e714533b5b7
      './images/mdn.png', // a26a173bd58c9ecdaa7fe393b31cc7e58be2263e
      './images/mdn@2x.png', // 15f4d6678de9e5c896559f334ea4c2e4928e862f
      './images/tabzilla-static-high-res.png', // b61a9911763194807cdd009d9772d8f74d9219f4
      './images/tabzilla-static.png', // daf1c7682b6197942b1c82b0790f57bf9605a13c
      './search.json', // 96f922ada25adc9efc871c236fea322bd1552513

    ],

    // Adds the resources to the cache controlled by this worker.
    cacheResources: function () {
      var now = Date.now();
      var baseUrl = self.location;
      return this.prepareCache()
      .then(cache => Promise.all(this.RESOURCES.map(resource => {
        // Bust the request to get a fresh response
        var url = new URL(resource, baseUrl);
        var bustParameter = (url.search ? '&' : '') + '__bust=' + now;
        var bustedUrl = new URL(url.toString());
        bustedUrl.search += bustParameter;

        // But cache the response for the original request
        var requestConfig = { credentials: 'same-origin' };
        var originalRequest = new Request(url.toString(), requestConfig);
        var bustedRequest = new Request(bustedUrl.toString(), requestConfig);
        return fetch(bustedRequest)
        .then(response => {
          if (response.ok) {
            return cache.put(originalRequest, response);
          }
          console.error('Error fetching ' + url + ', status was ' + response.status);
        });
      })));
    },

    // Remove the offline caches not controlled by this worker.
    clearOtherCaches: function () {
      var outOfDate = cacheName => cacheName.startsWith(this.CACHE_PREFIX) && cacheName !== this.CACHE_NAME;

      return self.caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
        .filter(outOfDate)
        .map(cacheName => self.caches.delete(cacheName))
      ));
    },

    // Get a response from the current offline cache or from the network.
    get: function (request) {
      return this.openCache()
      .then(cache => cache.match(() => this.extendToIndex(request)))
      .then(response => {
        if (response) {
          return response;
        }
        return self.fetch(request);
      });
    },

    // Make requests to directories become requests to index.html
    extendToIndex: function (request) {
      var url = new URL(request.url, self.location);
      var path = url.pathname;
      if (path[path.length - 1] !== '/') {
        return request;
      }
      url.pathname += 'index.html';
      return new Request(url.toString(), request);
    },

    // Prepare the cache for installation, deleting it before if it already exists.
    prepareCache: function () {
      return self.caches.delete(this.CACHE_NAME)
      .then(() => this.openCache());
    },

    // Open and cache the offline cache promise to improve the performance when
    // serving from the offline-cache.
    openCache: function () {
      if (!this._cache) {
        this._cache = self.caches.open(this.CACHE_NAME);
      }
      return this._cache;
    }

  };
}(self));
