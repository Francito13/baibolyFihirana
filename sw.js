var CACHE='sda-media-v1';
var URLS=[
  'index.html',
  'baibolyMG_v2.html',
  'fihirana_advantista.html',
  'manifest.json',
  'logoslide.png'
];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(URLS)}).then(self.skipWaiting));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(self.clients.claim));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request).then(function(r){
      return r||fetch(e.request).then(function(res){
        if(res&&res.status===200&&res.url.startsWith(self.location.origin)){
          var c=caches.open(CACHE).then(function(ca){ca.put(e.request,res.clone())});
        }
        return res;
      });
    }).catch(function(){return caches.match('index.html')})
  );
});