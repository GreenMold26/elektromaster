// Bedienlogikprüfung mit DOM-Attrappe, keine echte Browser-/Layoutprüfung.
import assert from 'node:assert/strict';
const RealDate=Date;let now=new RealDate(2026,10,2,12).getTime();globalThis.Date=class extends RealDate{constructor(...args){super(...(args.length?args:[now]));}static now(){return now;}};
const listeners={},elements=new Map(),store=new Map();let timer;
const el=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',value:'',open:false,scrollTop:0,focus(){},classList:{add(){},remove(){},toggle(){}},showModal(){this.open=true;},close(){this.open=false;},addEventListener(){},click(){}});return elements.get(id);};
globalThis.document={querySelector:el,activeElement:{focus(){}},body:{classList:{toggle(){}}},addEventListener:(type,fn)=>listeners[type]=fn,createElement:()=>({click(){}})};
globalThis.window={scrollTo(){}};globalThis.localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
globalThis.confirm=()=>true;globalThis.setInterval=fn=>{timer=fn;return 1;};globalThis.setTimeout=()=>1;
const click=(action,data={})=>listeners.click({target:{closest:s=>s==='[data-action]'?{dataset:{action,...data}}:null}});
const nav=route=>listeners.click({target:{closest:s=>s==='[data-route]'?{dataset:{route}}:null}});
const input=(id,value,dataset={})=>listeners.input({target:{id,value,dataset}});
const change=t=>listeners.change({target:{dataset:{},...t}});
const state=()=>JSON.parse(store.get('elektromaster.v2')),html=()=>el('#app').innerHTML;
await import('./app.js');
assert.match(html(),/Was möchtest du heute lernen/);click('module-enter',{id:'electro'});assert.match(html(),/TAGESZIEL: NEIN/);
const date='2026-11-02';nav('daily');assert.match(html(),/10 Fragen/);assert.match(html(),/5 Rechenaufgaben/);
click('daily-start',{mode:'mc',date});assert.match(html(),/Hilfe \/ Nachschlagen/);
let q=state().active.items[0];click('choose',{choice:String((q.answer+1)%4)});const before=JSON.stringify(state().active.inputs);
click('help-open');assert.equal(el('#help-dialog').open,true);assert.ok(el('#help-layer').innerHTML.includes(q.lesson));click('help-article',{id:q.lesson});assert.ok(el('#help-results').innerHTML.includes('Eigenständiges Beispiel'));click('help-close');assert.equal(JSON.stringify(state().active.inputs),before);assert.equal(el('#help-dialog').open,false);
click('check');click('pause');nav('daily');click('daily-start',{mode:'calc',date});
q=state().active.items[0];input('value-0','12,34',{field:'0'});change({dataset:{unit:'0'},value:q.fields[0].unit});
const numericBefore=JSON.stringify(state().active.inputs);click('help-open');input('help-search','Blindleistung');assert.match(el('#help-results').innerHTML,/Blindleistung/);click('help-close');assert.equal(JSON.stringify(state().active.inputs),numericBefore);click('pause');
await import('./app.js?reload=1');nav('daily');click('daily-start',{mode:'calc',date});assert.equal(state().active.inputs[0].values[0],'12,34');click('pause');
function fillWrong(){const s=state().active,q=s.items[s.index];if(q.options)click('choose',{choice:String((q.answer+1)%4)});else q.fields.forEach((f,i)=>{input('value-'+i,'-123',{field:String(i)});change({dataset:{unit:String(i)},value:f.unit});});click('check');}
nav('daily');click('daily-start',{mode:'mc',date});click('next');for(let i=1;i<10;i++){fillWrong();click('next');}
assert.equal(state().daily[date].mc.finished,true);assert.equal(state().daily[date].calc.finished,false);nav('dashboard');assert.match(html(),/TAGESZIEL: JA/);assert.match(html(),/Multiple Choice: <b>Abgeschlossen/);
const earned=state().xp;nav('daily');click('daily-start',{mode:'mc',date});for(let i=0;i<10;i++){fillWrong();click('next');}assert.equal(state().xp,earned);
nav('daily');click('daily-start',{mode:'calc',date});for(let i=0;i<5;i++){fillWrong();click('next');}
assert.equal(state().daily[date].calc.finished,true);assert.ok(state().dailyRewards.includes(date+':mc'));assert.ok(state().dailyRewards.includes(date+':calc'));
nav('lexicon');input('lex-search','Eigenerwärmung');assert.match(el('#lex-results').innerHTML,/Ohmsches Gesetz/);click('article',{id:'f0'});assert.match(html(),/Zusammenhänge verstehen/);click('favorite',{id:'f0'});assert.ok(state().favorites.includes('f0'));
nav('exam');click('exam-start');assert.ok(!html().includes('data-action="help-open"'));click('help-open');assert.equal(el('#help-dialog').open,false);assert.match(el('#toast').textContent,/Prüfungsmodus/);nav('lexicon');assert.match(html(),/TECHNIKPRÜFUNG/);nav('formulas');assert.match(html(),/TECHNIKPRÜFUNG/);
now=state().active.deadline+1;timer();assert.equal(state().active,null);
now=new RealDate(2026,10,3,0,1).getTime();nav('daily');timer();assert.ok(state().daily['2026-11-03']);assert.ok(!state().daily['2026-11-03'].mc.finished);assert.match(html(),/TAGESZIEL: NEIN/);
const backup=JSON.stringify(state());await change({id:'import-file',files:[{size:backup.length,text:async()=>backup}],value:'file'});assert.ok(state().favorites.includes('f0'));assert.ok(state().daily[date].mc.finished);
console.log('V2-Bedienlogik bestanden: Hilfe + Suche ohne Eingabeverlust, Prüfungssperre, parallele Tagestrainings, Neuladen/Fortsetzen, falsche Antworten als Abschluss, Wiederholung ohne XP, Favoriten, Tageswechsel und V2-Import.');
