import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {questions,formulas,lessons} from './content.js';
import {fresh as legacyFresh,record,generate,calcTypes,dayKey} from './engine.js';
import {fresh,loadState,validateBackup,validateSession,STORAGE_KEY,LEGACY_KEY,SAFETY_KEY} from './state.js';
import {ensureDay,finishDaily,goalReached,completedDays,dailyStreak,replayRun,seeded} from './daily.js';
import {articles,searchArticles,linksFor,formulasFor} from './knowledge.js';
import {diagramForTask,diagramForArticle} from './diagrams.js';
import {helpResults,modulePage} from './features.js';
let count=0;const ok=(condition,msg)=>{assert.ok(condition,msg);count++;};
const memory=initial=>{const data=new Map(Object.entries(initial||{}));return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),data};};
const old=legacyFresh();record(old,questions[0],1,{now:new Date(2026,9,30,12).getTime()});old.xp=1234;old.read=['f0','c0'];old.exams=[{date:123456,score:9,total:12}];old.active={items:[generate('motor')],index:0,inputs:[{values:['12'],units:['W']}],results:[],exam:false,finished:false,started:123};
const raw=JSON.stringify(old),storage=memory({[LEGACY_KEY]:raw});const migrated=loadState(storage);
ok(migrated.migrated,'Migration ausgeführt');assert.deepEqual(migrated.state.stats,old.stats);assert.deepEqual(migrated.state.days,old.days);assert.deepEqual(migrated.state.exams,old.exams);assert.deepEqual(migrated.state.read,old.read);assert.deepEqual(migrated.state.active.inputs,old.active.inputs);count+=5;
ok(migrated.state.xp===1234,'XP unverändert');ok(storage.getItem(LEGACY_KEY)===raw,'v1 unangetastet');ok(storage.getItem(SAFETY_KEY)===raw,'Originalsicherung');ok(loadState(storage).migrated===false,'Migration idempotent');
const noSpace={getItem:storage.getItem,setItem(){throw Error('Quota');}};const originalStore=memory({[LEGACY_KEY]:raw});const rescued=loadState({getItem:originalStore.getItem,setItem(){throw Error('Quota');}});
ok(rescued.state.xp===1234&&!!rescued.warning,'Quota erhält gelesenen Altstand');
const invalid=memory({[STORAGE_KEY]:'broken',[LEGACY_KEY]:raw});assert.throws(()=>loadState(invalid));ok(invalid.getItem(STORAGE_KEY)==='broken','Defekten Stand nicht überschreiben');
const s=fresh();const date='2026-11-02',today=new Date(2026,10,2,12);const day=ensureDay(s,date),signature=JSON.stringify(day);
ok(day.mc.items.length===10&&day.calc.items.length===5,'Standardumfang 10 + 5');
ok(day.mc.items.every(q=>q.options&&!q.fields),'Nur MC');ok(day.calc.items.every(q=>q.fields&&!q.options),'Nur Rechnen');
ok(new Set(day.mc.items.map(q=>q.group)).size===4,'Vier Themen im MC');ok(new Set(day.mc.items.map(q=>q.level)).size===2,'Zwei Schwierigkeitsstufen');
ok(new Set(day.calc.items.map(q=>q.id)).size===5,'Unterschiedliche Rechentypen');
ensureDay(s,date);ok(JSON.stringify(day)===signature,'Auswahl bleibt fest');
const again=validateBackup(JSON.parse(JSON.stringify(s)));ok(JSON.stringify(ensureDay(again,date))===signature,'Auswahl bleibt nach Import fest');
s.dailySettings={mc:15,calc:8};ok(ensureDay(s,date).mc.items.length===10,'Laufender Tag behält Umfang');ok(ensureDay(s,'2026-11-03').mc.items.length===15,'Neuer Tag nutzt Umfang');ok(s.daily['2026-11-03'].calc.items.length===8,'Neuer Rechenumfang');
for(const q of [...questions,...calcTypes.map(t=>generate(t.id))]){const ids=linksFor(q);ok(ids.length>0&&ids.every(id=>articles.some(a=>a.id===id)),'Hilfelinks '+q.id);}
ok(linksFor(generate('motor')).length===3,'Mehrthemenhilfe Motor');ok(linksFor(generate('transformer')).includes('t-ratings'),'Trafo-Gesamtbilanz');
for(const a of articles){ok(a.details.length>100&&a.example.steps.length>=2,'Ausführlicher Eintrag '+a.id);ok(a.related.every(id=>articles.some(b=>b.id===id)),'Verwandte Einträge');ok(formulasFor(a).every(f=>f.formula&&f.symbols),'Formeln und Einheiten');ok(searchArticles(a.title).some(x=>x.id===a.id),'Titel im Volltext '+a.id);}
ok(searchArticles('Eigenerwärmung').some(a=>a.id==='f0'),'Detailtext durchsuchbar');ok(searchArticles('0,1089').some(a=>a.id==='f12'),'Beispiel durchsuchbar');ok(searchArticles('Leitwert',{favorites:['f8']}).length===1,'Favoritenfilter');ok(searchArticles('',{category:'transformers'}).length>=6,'Trafokategorie');
ok(modulePage().match(/data-action="module-enter"/g).length===1,'Nur Elektrotechnik auswählbar');
function answerWrong(run){run.items.forEach((q,i)=>{run.inputs[i]=q.options?{choice:(q.answer+1)%4}:{values:q.fields.map(()=>'-123'),units:q.fields.map(f=>f.unit)};run.results[i]={points:0,total:q.fields?.length||1,marks:Array(q.fields?.length||1).fill(false)};});}
ok(!finishDaily(s,day.mc,today),'Unbearbeitete Einheit zählt nicht');answerWrong(day.mc);ok(finishDaily(s,day.mc,today),'Auch falsche Antworten können abschließen');ok(goalReached(s,date),'Ein Training erfüllt Tagesziel');ok(!day.calc.finished,'Modi unabhängig');const xp=s.xp;finishDaily(s,day.mc,new Date(2026,10,4));ok(s.xp===xp&&day.mc.completedOn===date,'Abschluss idempotent über Tageswechsel');
const replay=replayRun(day.mc);answerWrong(replay);finishDaily(s,replay,new Date(2026,10,4));ok(s.xp===xp&&!goalReached(s,'2026-11-04'),'Wiederholung ohne XP oder neuen Abschlusstag');
answerWrong(day.calc);finishDaily(s,day.calc,today);ok(s.xp===xp+50,'Zweiter Modus eigener Bonus');ok(completedDays(s).length===1,'Trainingstag einmal zählen');
const next=ensureDay(s,'2026-11-03');answerWrong(next.calc);finishDaily(s,next.calc,new Date(2026,10,3,0,5));ok(dailyStreak(s,new Date(2026,10,3,12))===2,'Zwei Trainingstage');ok(dailyStreak(s,new Date(2026,10,4,12))===2,'Heutiger offener Tag toleriert');ok(dailyStreak(s,new Date(2026,10,5,12))===0,'Lücke setzt Serie zurück');
const overnight=ensureDay(s,'2026-11-05');answerWrong(overnight.mc);finishDaily(s,overnight.mc,new Date(2026,10,6,0,1));ok(!goalReached(s,'2026-11-05')&&!goalReached(s,'2026-11-06'),'Nachholung ändert weder früheres noch heutiges Tagesziel');
const dst=fresh();for(const d of [24,25,26]){const date=dayKey(new Date(2026,9,d,12));const r=ensureDay(dst,date).mc;answerWrong(r);finishDaily(dst,r,new Date(2026,9,d,12));}ok(dailyStreak(dst,new Date(2026,9,26,12))===3,'Kalendertage über Zeitumstellung');
s.favorites=['f0','t-ratings'];s.helpUses={'f0a':3};const restored=validateBackup(JSON.parse(JSON.stringify(s)));assert.deepEqual(restored,s);count++;
const bad=structuredClone(s);bad.daily[date].mc.items[0].options=['x','x','x','x'];assert.throws(()=>validateBackup(bad));count++;
const partial=fresh(),r=ensureDay(partial,date).calc;r.inputs[0]={values:['1,2'],units:['A']};r.index=0;partial.active=r;
const restoredLocal=validateBackup(JSON.parse(JSON.stringify(partial)),{local:true});assert.deepEqual(restoredLocal.active.inputs,r.inputs);count++;
ok(validateBackup(JSON.parse(JSON.stringify(partial))).active===null,'Normale aktive Referenz nicht importiert');ok(validateBackup(JSON.parse(JSON.stringify(partial))).daily[date].calc.inputs[0].values[0]==='1,2','Tagesfortschritt importiert');
for(let seed=1;seed<=50;seed++){const q={...generate('parallel',seeded(seed)),seed};const svg=diagramForTask(q);for(const key of ['R1','R2','R3'])ok(svg.includes(String(q.values[key])+' Ω'),'Dynamischer Widerstand');ok(!svg.includes('undefined'),'Keine fehlende Beschriftung');}
ok(diagramForTask(generate('motor')).includes('400 V'),'Motorspannung');ok(diagramForTask(generate('sensor')).includes('mA'),'Sensorsignal');ok(diagramForArticle('f5').includes('Parallelschaltung'),'Passendes Lexikonbild');ok(diagramForArticle('c25')==='','Kein generisches Dekobild');
const q=generate('motor',()=>.5),help=helpResults(q,'',fresh());ok(!help.includes(q.prompt)&&!help.includes(q.explanation),'Keine aktuelle Lösung im Hilfeindex');
for(let i=0;i<100;i++){const st=fresh(),d=new Date(2026,0,i+1),key=dayKey(d);const run=ensureDay(st,key);ok(new Set(run.mc.items.map(q=>q.id)).size===10,'Keine Tagesduplikate');ok(run.calc.items.length===5,'Fünf Tagesrechenaufgaben');validateBackup(JSON.parse(JSON.stringify(st)));}
const sw=await readFile(new URL('./sw.js',import.meta.url),'utf8');for(const file of ['knowledge.js','state.js','daily.js','diagrams.js','features.js','platform.js'])ok(sw.includes('./'+file),'Offline-Datei '+file);
console.log(count+' Prüfungen für Migration, Tageswechsel, Tagestrainings, Hilfe, Lexikon und Bilder bestanden.');
