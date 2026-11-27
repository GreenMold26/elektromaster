const VERSION='2.1.0';
const CACHE='elektromaster-'+VERSION+'-'+new URL(self.registration.scope).pathname;
const FILES=['./','./index.html','./style.css','./app.js','./content.js','./engine.js','./state.js','./daily.js','./knowledge.js','./diagrams.js','./features.js','./platform.js','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(file=>new Request(new URL(file,self.registration.scope),{cache:'reload'}))))));
// Kein erzwungenes Aktivieren während einer laufenden Lerneinheit.
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 event.respondWith(caches.open(CACHE).then(async cache=>{
 const hit=await cache.match(event.request);if(hit)return hit;
 try{return await fetch(event.request);}catch{return event.request.mode==='navigate'?(await cache.match(new URL('./index.html',self.registration.scope)))||Response.error():Response.error();}
 }));
});
