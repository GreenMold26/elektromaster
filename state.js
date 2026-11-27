import {fresh as legacyFresh,validateBackup as legacyValidate,calcTypes,generate} from './engine.js';
import {questions,lessons} from './content.js';
import {seeded,normalizeRun,trainingId} from './daily.js';
export const STORAGE_KEY='elektromaster.v2',LEGACY_KEY='elektromaster.v1',SAFETY_KEY='elektromaster.before-v2';
export const fresh=()=>({...legacyFresh(),version:2,favorites:[],daily:{},dailySettings:{mc:10,calc:5},dailyRewards:[],helpUses:{},moduleData:{},selectedModule:'electro'});
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const string=x=>typeof x==='string'&&x.length<20000;
function dateKey(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const [y,m,d]=s.split('-').map(Number),v=new Date(y,m-1,d);return v.getFullYear()===y&&v.getMonth()===m-1&&v.getDate()===d;}
export function validateSession(value,{strict=false}={}){
 try{
 if(!object(value)||!Array.isArray(value.items)||!value.items.length||value.items.length>40||!Number.isInteger(value.index)||value.index<0||value.index>=value.items.length||!Array.isArray(value.inputs)||!Array.isArray(value.results))throw Error('Ungültige Lerneinheit');
 const s=structuredClone(value);
 s.items=s.items.map(q=>{
 if(!object(q))throw Error('Ungültige Aufgabe');
 if(q.options){const source=questions.find(x=>x.id===q.id);if(!source||q.options.length!==4||new Set(q.options).size!==4||q.options.some(a=>!source.options.includes(a)))throw Error('Unbekannte Frage');return {...source,options:[...q.options],answer:q.options.indexOf(source.options[source.answer])};}
 const id=q.id?.replace('calc-','');if(!calcTypes.some(t=>t.id===id))throw Error('Unbekannte Rechenvorlage');
 if(Number.isInteger(q.seed)&&q.seed>=0&&q.seed<=4294967295)return {...generate(id,seeded(q.seed)),seed:q.seed};
 // Alte laufende Einheiten besitzen noch keinen Seed. Sichere Struktur prüfen.
 const units=new Set(['A','V','W','kWh','Ω','s','N·m','%','1/min','kvar','kVA','bar']);
 if(!string(q.prompt)||!string(q.type)||!object(q.values)||Object.values(q.values).some(v=>!Number.isFinite(v))||!Array.isArray(q.fields)||!q.fields.length||q.fields.length>5||q.fields.some(f=>!object(f)||!string(f.label)||!Number.isFinite(f.answer)||!units.has(f.unit)||!Array.isArray(f.steps)||f.steps.some(x=>!string(x))))throw Error('Ungültige Rechenaufgabe');
 return q;});
 if(s.inputs.length>s.items.length||s.results.length>s.items.length)throw Error('Ungültige Antworten');
 s.inputs=s.inputs.map((input,i)=>{if(input==null)return null;if(!object(input))throw Error('Ungültige Eingabe');const q=s.items[i];if(input.choice!==undefined&&(!Number.isInteger(input.choice)||input.choice<0||input.choice>3))throw Error('Ungültige Auswahl');if(input.values!==undefined&&(!Array.isArray(input.values)||input.values.length>5||input.values.some(v=>v!=null&&(typeof v!=='string'||v.length>200))))throw Error('Ungültige Zahleneingabe');if(input.units!==undefined&&(!Array.isArray(input.units)||input.units.some(v=>v!=null&&!string(v))))throw Error('Ungültige Einheiten');return input;});
 s.results=s.results.map((r,i)=>{if(r==null)return null;const total=s.items[i].fields?.length||1;if(!object(r)||!Number.isInteger(r.points)||r.points<0||r.points>total||r.total!==total||!Array.isArray(r.marks)||r.marks.length!==total||r.marks.some(m=>typeof m!=='boolean'))throw Error('Ungültige Bewertung');return r;});
 if(s.exam&&!Number.isFinite(s.deadline))throw Error('Ungültige Prüfungszeit');
 if(s.daily&&(!dateKey(s.daily.date)||!['mc','calc'].includes(s.daily.mode)||s.exam))throw Error('Ungültiges Tagestraining');
 if(s.completedOn&&!dateKey(s.completedOn))throw Error('Ungültiger Abschlusstag');
 if(s.finished&&s.daily&&s.items.some((q,i)=>!s.results[i]||!s.inputs[i]))throw Error('Unvollständiger Abschluss');
 if(s.daily){
 if(s.trainingId!==undefined&&s.trainingId!==trainingId(s.daily.date,s.daily.mode))throw Error('Ungültige Trainings-ID');
 if(s.status!==undefined&&!['offen','begonnen','abgeschlossen','übersprungen'].includes(s.status))throw Error('Ungültiger Trainingszustand');
 if(s.status!==undefined&&((s.status==='abgeschlossen')!==!!s.finished))throw Error('Widersprüchlicher Trainingszustand');
 if(s.goalDate!==undefined&&s.goalDate!==null&&(!dateKey(s.goalDate)||!s.finished))throw Error('Ungültiger Zieltag');
 if(s.skippedOn!==undefined&&!dateKey(s.skippedOn))throw Error('Ungültiger Überspringtag');
 normalizeRun(s);
 }
 return s;
 }catch(e){if(strict)throw e;return null;}
}
export function validateBackup(input,{local=false}={}){
 if(!object(input)||![1,2].includes(input.version))throw Error('Keine gültige ElektroMaster-Sicherung (Version 1 oder 2).');
 const base=legacyValidate({...input,version:1});const s={...fresh(),...base,version:2};
 if(input.version===2){
 if(!object(input.daily)||!Array.isArray(input.favorites)||!object(input.dailySettings)||!Array.isArray(input.dailyRewards)||!object(input.helpUses)||!object(input.moduleData))throw Error('Unvollständiges Version-2-Backup.');
 if(![5,10,15,20].includes(input.dailySettings.mc)||![3,5,8,10].includes(input.dailySettings.calc))throw Error('Ungültiger Trainingsumfang.');
 s.dailySettings={mc:input.dailySettings.mc,calc:input.dailySettings.calc};
 const known=new Set(lessons.map(l=>l.id).concat(['t-ratings']));
 s.favorites=[...new Set(input.favorites.filter(id=>known.has(id)))];
 if(Object.keys(input.daily).length>5000)throw Error('Zu viele Trainingstage.');
 for(const [date,d] of Object.entries(input.daily)){if(!dateKey(date)||!object(d))throw Error('Ungültiges Trainingsdatum');const entry={};for(const mode of ['mc','calc']){const run=validateSession(d[mode],{strict:true});if(run.daily?.date!==date||run.daily?.mode!==mode||run.items.some(q=>mode==='mc'?!q.options:!q.fields))throw Error('Tagestraining passt nicht zum Datum oder Modus');entry[mode]=run;}s.daily[date]=entry;}
 s.dailyRewards=[...new Set(input.dailyRewards.filter(v=>typeof v==='string'&&dateKey(v.slice(0,10))&&/:(mc|calc)$/.test(v)))];
 for(const [id,n]of Object.entries(input.helpUses))if(/^(f\d+[abc]|c\d+a|x\d+|calc-[a-z]+)$/.test(id)&&Number.isInteger(n)&&n>=0&&n<1e9)s.helpUses[id]=n;
 // Reservierter Bereich für zukünftige, registrierte Module; fremde Inhalte werden nicht ausgeführt.
 s.moduleData=structuredClone(input.moduleData);
 }
 if(local){
 s.active=validateSession(input.active);
 // Ein Tageslauf hat genau eine maßgebliche gespeicherte Instanz.
 if(s.active?.daily&&!s.active.daily.replay){const d=s.active.daily;s.active=s.daily[d.date]?.[d.mode]||null;if(s.active?.status==='übersprungen'||s.active?.finished)s.active=null;}
 }
 return s;
}
export function loadState(storage){
 const raw=storage.getItem(STORAGE_KEY);if(raw!==null)return {state:validateBackup(JSON.parse(raw),{local:true}),migrated:false};
 const old=storage.getItem(LEGACY_KEY);if(old===null)return {state:fresh(),migrated:false};
 const state=validateBackup(JSON.parse(old),{local:true});
 // Die alte Version wird nicht überschrieben. Erst Sicherung, dann neuen Speicher schreiben.
 try { if(storage.getItem(SAFETY_KEY)===null)storage.setItem(SAFETY_KEY,old); storage.setItem(STORAGE_KEY,JSON.stringify(state)); } catch { return {state,migrated:false,warning:'Migration gelesen, aber nicht gespeichert. Bitte ein Backup exportieren.'}; }
 return {state,migrated:true};
}
