import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('sw.js',import.meta.url),'utf8');
const handlers={},stores=new Map(),scope='https://example.test/elektromaster/';
let claimed=false,activated=false,network=false,reloads=0;
function key(req){return typeof req==='string'?new URL(req,scope).href:req instanceof URL?req.href:req.url;}
const caches={async open(name){if(!stores.has(name))stores.set(name,new Map());const data=stores.get(name);return {
 async addAll(requests){const pending=[];for(const request of requests){assert.equal(request.cache,'reload');reloads++;const suffix=new URL(request.url).pathname.slice('/elektromaster/'.length);const body=await readFile(new URL(suffix||'index.html',import.meta.url));pending.push([key(request),new Response(body)]);}for(const [k,v]of pending)data.set(k,v);},
 async match(req){return data.get(key(req))?.clone();}
 };}};
vm.runInNewContext(source,{URL,Request,Response,caches,fetch:async()=>{network=true;throw Error('offline');},self:{registration:{scope},location:{origin:'https://example.test'},addEventListener:(t,fn)=>handlers[t]=fn,clients:{claim:async()=>{claimed=true;}},skipWaiting:()=>{activated=true;}}});
let pending;handlers.install({waitUntil:p=>pending=p});await pending;assert.ok(reloads===16);assert.equal(activated,false);
handlers.activate({waitUntil:p=>pending=p});await pending;assert.ok(claimed);
const cached=[...stores.values()][0];for(const url of cached.keys()){let response;handlers.fetch({request:new Request(url),respondWith:p=>response=p});assert.ok((await response).ok);}assert.equal(network,false);
let fallback;handlers.fetch({request:{method:'GET',url:scope+'unbekannte-route',mode:'navigate'},respondWith:p=>fallback=p});assert.match(await (await fallback).text(),/ElektroMaster/);
let external=false;handlers.fetch({request:new Request('https://external.test/a'),respondWith:()=>external=true});assert.equal(external,false);
handlers.message({data:{type:'IGNORED'}});assert.equal(activated,false);handlers.message({data:{type:'ACTIVATE_UPDATE'}});assert.equal(activated,true);
console.log('Offline-Worker-Modell bestanden: '+cached.size+' lokale Ressourcen, Unterpfad, Cache-only-Abruf ohne Netzwerk, Navigationsfallback und kontrollierte Updateaktivierung.');
