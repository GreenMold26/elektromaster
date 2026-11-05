import {questions,groups} from './content.js';
import {generate,calcTypes,shuffledQuestion,shuffle,dayKey} from './engine.js';
export function seeded(seed){let n=seed>>>0;return ()=>{n=(Math.imul(1664525,n)+1013904223)>>>0;return n/4294967296;};}
export function hash(text){let h=2166136261;for(const c of text)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
export function createRun(items,now=Date.now(),daily=null){return {items,index:0,results:[],inputs:[],exam:false,deadline:null,started:now,finished:false,daily};}
export function ensureDay(state,date=dayKey()){
 if(state.daily[date])return state.daily[date];
 const rng=seeded(hash('electromaster-2:'+date));const recent=new Set(Object.entries(state.daily).filter(([d])=>d<date).sort(([a],[b])=>b.localeCompare(a)).slice(0,3).flatMap(([,v])=>v.mc.items.map(q=>q.id)));
 let pool=shuffle(questions,rng);const selected=[];const weak=q=>{const v=state.stats[q.id];return v&&v.correct/v.attempts<.7?0:1;};
 // Themenwechsel und Wechsel der Stufen; Fehler werden innerhalb der Gruppe bevorzugt.
 for(let i=0;i<state.dailySettings.mc;i++){const group=groups[i%groups.length].id,level=i%2+1;let candidates=pool.filter(q=>q.group===group&&q.level===level);if(!candidates.length)candidates=pool.filter(q=>q.group===group);if(!candidates.length)candidates=pool;
 candidates.sort((a,b)=>weak(a)-weak(b)||Number(recent.has(a.id))-Number(recent.has(b.id)));
 const q=candidates[0];selected.push(shuffledQuestion(q,rng));pool=pool.filter(x=>x.id!==q.id);}
 const types=shuffle(calcTypes,rng),used=new Set(),numeric=[];
 for(let i=0;i<state.dailySettings.calc;i++){const g=groups[i%groups.length].id;const t=types.find(t=>t.group===g&&!used.has(t.id))||types.find(t=>!used.has(t.id));used.add(t.id);const seed=Math.floor(rng()*4294967296);numeric.push({...generate(t.id,seeded(seed)),seed});}
 return state.daily[date]={mc:createRun(selected,Date.now(),{date,mode:'mc'}),calc:createRun(numeric,Date.now(),{date,mode:'calc'})};
}
export function isComplete(run){return run.items.length>0&&run.items.every((q,i)=>{const r=run.results[i],input=run.inputs[i];return r&&input&&(q.options?Number.isInteger(input.choice):q.fields.every((_,j)=>String(input.values?.[j]??'').trim()&&input.units?.[j]));});}
export function finishDaily(state,run,now=new Date()){
 if(!run.daily||!isComplete(run))return false;
 if(run.finished&&!run.daily.replay)return true;
 const today=dayKey(now),key=today+':'+run.daily.mode;
 const original=state.daily[run.daily.date]?.[run.daily.mode];if(!original)return false;
 run.finished=true;
 if(!run.daily.replay){run.completedOn=today;run.completedAt=now.getTime();state.daily[run.daily.date][run.daily.mode]=run;}
 // Abschlussbonus nur einmal je Training und höchstens einmal je Modus am Abschlusstag.
 if(!run.daily.replay&&!state.dailyRewards.includes(key)){state.xp+=50;state.dailyRewards.push(key);}
 return true;
}
export function completedDays(state){return [...new Set(Object.values(state.daily).flatMap(d=>[d.mc,d.calc]).filter(r=>r.finished&&r.completedOn).map(r=>r.completedOn))].sort();}
export const goalReached=(state,date=dayKey())=>completedDays(state).includes(date);
export function dailyStreak(state,now=new Date()){const days=new Set(completedDays(state));const d=new Date(now);if(!days.has(dayKey(d)))d.setDate(d.getDate()-1);let n=0;while(days.has(dayKey(d))){n++;d.setDate(d.getDate()-1);}return n;}
export function replayRun(run){return createRun(structuredClone(run.items),Date.now(),{...run.daily,replay:true});}
export function syncDaily(state,run){if(run?.daily&&!run.daily.replay)state.daily[run.daily.date][run.daily.mode]=run;}
