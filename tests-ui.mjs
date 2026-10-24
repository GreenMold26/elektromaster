// Test der Bedienlogik in einer minimalen DOM-Attrappe, kein Browser-/Layouttest.
import assert from 'node:assert/strict';
const listeners={},elements=new Map(),store=new Map();let timer;
function el(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',value:'',classList:{add(){},remove(){},toggle(){}},click(){},files:[]});return elements.get(id);}
globalThis.document={querySelector:el,body:{classList:{toggle(){}}},addEventListener:(type,fn)=>listeners[type]=fn,createElement:()=>({click(){}})};
globalThis.window={scrollTo(){}};
globalThis.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
globalThis.confirm=()=>true;
globalThis.setInterval=fn=>{timer=fn;return 1;};
globalThis.setTimeout=()=>1;
const click=(action,data={})=>listeners.click({target:{closest:selector=>selector==='[data-action]'?{dataset:{action,...data}}:null}});
const nav=route=>listeners.click({target:{closest:selector=>selector==='[data-route]'?{dataset:{route}}:null}});
const saved=()=>JSON.parse(store.get('elektromaster.v1'));
const html=()=>el('#app').innerHTML;
const change=target=>listeners.change({target:{dataset:{},...target}});
const input=target=>listeners.input({target});
await import('./app.js');
assert.match(html(),/Wissen, das bleibt/);
for(const r of ['learn','formulas','train','exam','review','stats','settings']){nav(r);assert.ok(html().includes('<main'));assert.ok(!html().includes('undefined'));}
nav('dashboard');click('quick');assert.match(html(),/Aufgabe 1 von 10/);
for(let i=0;i<10;i++){const q=saved().active.items[i];click('choose',{choice:String(q.answer)});click('check');assert.match(html(),/Richtig gelöst/);click('next');}
assert.equal(saved().active,null);assert.match(html(),/100 %/);assert.equal(saved().xp,200);
nav('train');click('mode',{id:'calc'});el('#train-group').value='all';el('#difficulty').value='auto';el('#calc-type').value='motor';click('start');
for(let i=0;i<10;i++){const q=saved().active.items[i];for(let j=0;j<q.fields.length;j++){input({dataset:{field:String(j)},value:String(q.fields[j].answer).replace('.',',')});change({dataset:{unit:String(j)},value:q.fields[j].unit});}click('check');assert.match(html(),/Richtig gelöst/);click('next');}
assert.match(html(),/30 von 30 Punkten/);assert.equal(saved().xp,220);
nav('exam');click('exam-start');const first=saved().active.items[0];click('choose',{choice:String(first.answer)});assert.ok(!html().includes('Richtige Antwort:'));click('next');click('prev');assert.equal(saved().active.inputs[0].choice,first.answer);
click('pause');assert.match(html(),/Prüfung wartet/);click('resume');
const count=saved().active.items.length;
for(let i=0;i<count;i++){click('jump',{index:String(i)});const q=saved().active.items[i];if(q.options)click('choose',{choice:String(q.answer)});else for(let j=0;j<q.fields.length;j++){input({dataset:{field:String(j)},value:String(q.fields[j].answer)});change({dataset:{unit:String(j)},value:q.fields[j].unit});}}
click('submit-exam');assert.equal(saved().exams.length,1);assert.equal(saved().exams[0].score,saved().exams[0].total);assert.match(html(),/PRÜFUNG ABGESCHLOSSEN/);
nav('settings');const backup=saved();await change({id:'import-file',files:[{size:1000,text:async()=>JSON.stringify(backup)}],value:'file'});assert.equal(saved().xp,backup.xp);
await change({id:'import-file',files:[{size:1000,text:async()=>'{"version":99}'}],value:'file'});assert.equal(saved().xp,backup.xp);
nav('exam');click('exam-start');const now=Date.now,deadline=saved().active.deadline;Date.now=()=>deadline+1;timer();Date.now=now;assert.equal(saved().active,null);assert.equal(saved().exams.length,2);assert.equal(saved().exams[1].score,0);
console.log('Bedienlogik bestanden: Navigation, 10 Quizantworten, 30 numerische Teilantworten, Prüfung vor/zurück, Unterbrechen/Fortsetzen, verzögerte Auswertung, Import, Fehlerimport, Zeitablauf.');
