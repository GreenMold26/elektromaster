import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {questions,lessons,formulas,groups} from './content.js';
import {generate,calcTypes,fresh,record,validateBackup,markNumeric,parseNumber,dayKey,streak,shuffledQuestion,selectQuestions,dueQuestions} from './engine.js';
let checks=0;
const check=(ok,msg)=>{assert.ok(ok,msg);checks++;};
check(questions.length>=100,'Mindestens 100 Fragen');
check(new Set(questions.map(q=>q.id)).size===questions.length,'Eindeutige IDs');
for(const q of questions){check(q.options.length===4,q.id+' vier Antworten');check(new Set(q.options).size===4,q.id+' eindeutige Antworten');check(q.answer>=0&&q.answer<4,q.id+' Lösung');check(lessons.some(l=>l.id===q.lesson),q.id+' Modulverweis');check(groups.some(g=>g.id===q.group),q.id+' Gruppe');const s=shuffledQuestion(q,()=>.6);check(s.options[s.answer]===q.options[q.answer],q.id+' Mischen erhält Lösung');}
for(const g of groups)check(questions.some(q=>q.group===g.id),'Thema vertreten');
const approx=(a,b,msg)=>check(Math.abs(a-b)<=Math.max(1e-9,Math.abs(b)*1e-10),msg);
const refs={
ohm:v=>[v.U/v.R],power:v=>[v.U*v.I,v.U*v.I*v.t/1000],
parallel:v=>{const r=1/(1/v.R1+1/v.R2)+v.R3;return[r,v.U/r];},
rc:v=>[v.R*v.C/1e6,5*v.R*v.C/1e6],
xl:v=>[Math.PI*2*v.f*v.L*.001],xc:v=>[1e6/(2*Math.PI*v.f*v.C)],
rl:v=>[Math.sqrt(v.R*v.R+v.X*v.X),v.U/Math.sqrt(v.R*v.R+v.X*v.X)],
motor:v=>{const p=Math.sqrt(3)*v.U*v.I*v.cos;return[p,p*v.eta,p*v.eta/(v.n/60*2*Math.PI)];},
transformer:v=>{const loss=v.Fe+v.CuN*v.beta*v.beta;const p=v.SN*v.beta*v.cos;return[loss,100/(1+loss/p)];},
slip:v=>[60*v.f/v.p,100*v.s],
comp:v=>[v.P*(Math.sqrt(1-v.c1*v.c1)/v.c1-Math.sqrt(1-v.c2*v.c2)/v.c2)/1000,v.P/v.c2/1000],
drop:v=>{const r=v.rho*(v.l*2)/v.A;return[r*v.I,v.U-r*v.I];},
sensor:v=>[v.max*(v.I-4)/16,(v.I-4)/.16],
turns:v=>[v.U1*v.N2/v.N1,v.I2*v.N2/v.N1],
star:v=>[v.U/(v.R*Math.sqrt(3)),v.U/v.R*Math.sqrt(3)],
uk:v=>[Math.sqrt(v.uk*v.uk-v.ur*v.ur),v.IN/(v.uk*.01)]
};
let seed=12839;const rng=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
for(const t of calcTypes){let seen=new Set();for(let i=0;i<200;i++){const q=generate(t.id,rng),expected=refs[t.id](q.values);seen.add(q.prompt);q.fields.forEach((f,j)=>{approx(f.answer,expected[j],t.id+' Referenz');check(Number.isFinite(f.answer)&&f.answer>0,t.id+' physikalischer Wertebereich');check(markNumeric(f,String(f.answer).replace('.',','),f.unit),t.id+' Komma');check(markNumeric(f,String(f.answer*1.009),f.unit),t.id+' Rundung innerhalb 1%');check(!markNumeric(f,String(f.answer*1.02),f.unit),t.id+' Fehler außerhalb Toleranz');check(!markNumeric(f,String(f.answer),'falsche Einheit'),t.id+' Einheit');check(f.steps.length>0,t.id+' Rechenweg');});}check(seen.size>1,t.id+' variiert');}
check(Number.isNaN(parseNumber('1.000,5')),'Keine mehrdeutigen Tausendertrennzeichen');
for(const bad of ['', 'abc','Infinity','NaN','2A','0x10'])check(Number.isNaN(parseNumber(bad)),'Ungültige Zahl '+bad);
approx(parseNumber('1,5e-3'),.0015,'Wissenschaftliche Notation');
const s=fresh(),q=questions[0],now=new Date(2026,9,24,12).getTime();
record(s,q,1,{now});check(s.xp===20,'20 XP');record(s,q,1,{now});check(s.xp===20,'Kein XP-Farming am gleichen Tag');record(s,q,1,{now});check(s.stats[q.id].run===3,'Drei sichere Treffer');check(s.stats[q.id].due===now+7*864e5,'7 Tage Abstand');record(s,q,1,{now,uncertain:true});check(s.stats[q.id].run===0&&s.stats[q.id].due===now,'Unsicherheit setzt zurück');record(s,q,0,{now});check(s.stats[q.id].run===0&&s.stats[q.id].correct===4,'Fehlerstatistik');check(dueQuestions(s,now).some(v=>v.id===q.id),'Fällige Wiederholung');
record(s,questions[1],1,{now:now-864e5});check(streak(s,new Date(now))===2,'Tagesfolge');
const restored=validateBackup(JSON.parse(JSON.stringify(s)));assert.deepEqual(restored,s); checks++;
assert.throws(()=>validateBackup({...s,version:99}));checks++;assert.throws(()=>validateBackup({...s,stats:{[q.id]:{...s.stats[q.id],correct:-1}}}));checks++;
check(selectQuestions(fresh(),questions,10).every(q=>q.level===1),'Adaptive Grundlagen');
for(const f of formulas)check(f.symbols&&f.example&&f.mistake&&f.rearranged,'Vollständige Formel '+f.id);
const files=['index.html','style.css','app.js','content.js','engine.js','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png'];
for(const file of files)check((await stat(new URL(file,import.meta.url))).size>0,'Datei '+file);
const sw=await readFile(new URL('sw.js',import.meta.url),'utf8');
for(const file of files)check(sw.includes('./'+file),'Offline-Cache '+file);
const manifest=JSON.parse((await readFile(new URL('manifest.webmanifest',import.meta.url),'utf8')).replace(/^\uFEFF/,''));
check(manifest.start_url==='./'&&manifest.scope==='./','Unterpfadfähige PWA');
console.log(JSON.stringify({passed:checks,questions:questions.length,formulas:formulas.length,lessons:lessons.length,calcTypes:calcTypes.length,randomizedTasks:calcTypes.length*200},null,2));
