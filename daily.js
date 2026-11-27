import {questions,groups} from './content.js';
import {generate,calcTypes,shuffledQuestion,shuffle,dayKey} from './engine.js';
export function seeded(seed){let n=seed>>>0;return ()=>{n=(Math.imul(1664525,n)+1013904223)>>>0;return n/4294967296;};}
export function hash(text){let h=2166136261;for(const c of text)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
export const trainingId=(date,mode)=>'electro:'+date+':'+mode;
export function normalizeRun(run){
 if(!run?.daily)return run;
 run.trainingId=trainingId(run.daily.date,run.daily.mode);
 // Alte gezählte Abschlusstage bleiben beim Update unverändert.
 if(run.goalDate===undefined)run.goalDate=run.finished?(run.completedOn||null):null;
 if(!run.status)run.status=run.finished?'abgeschlossen':run.inputs.some(Boolean)||run.results.some(Boolean)?'begonnen':'offen';
 return run;
}
export function createRun(items,now=Date.now(),daily=null){return normalizeRun({items,index:0,results:[],inputs:[],exam:false,deadline:null,started:now,finished:false,daily});}
export function startDaily(state,date,mode){
 const run=state.daily[date]?.[mode];if(!run)return null;
 if(state.active?.daily)syncDaily(state,state.active);
 normalizeRun(run);
 if(run.finished)return replayRun(run);
 run.status='begonnen';return run;
}
export function skipDaily(state,date,mode,today=dayKey()){
 const run=state.daily[date]?.[mode];if(!run||date>=today||run.finished)return false;
 normalizeRun(run);run.status='übersprungen';run.skippedOn=today;
 if(state.active?.trainingId===run.trainingId)state.active=null;
 return true;
}
export function trainingHistory(state,today=dayKey()){
 const dates=Object.keys(state.daily).filter(d=>d<=today).sort();if(!dates.length)return [];
 const achieved=new Set(completedDays(state)),rows=[],cursor=new Date(dates[0]+'T12:00:00');
 while(dayKey(cursor)<=today&&rows.length<5000){const date=dayKey(cursor),runs=state.daily[date];
 rows.push({date,runs,achieved:achieved.has(date),missed:date<today&&!achieved.has(date)});cursor.setDate(cursor.getDate()+1);}
 return rows.reverse();
}
export function ensureDay(state,date=dayKey()){
 if(state.daily[date]){Object.values(state.daily[date]).forEach(normalizeRun);return state.daily[date];}
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
 if(!run.daily||run.status==='übersprungen'||!isComplete(run))return false;
 if(run.finished&&!run.daily.replay)return true;
 const today=dayKey(now),key=run.daily.date+':'+run.daily.mode;
 const original=state.daily[run.daily.date]?.[run.daily.mode];if(!original)return false;
 normalizeRun(run);run.finished=true;run.status='abgeschlossen';
 if(!run.daily.replay){run.completedOn=today;run.completedAt=now.getTime();run.goalDate=run.daily.date===today?today:null;run.madeUp=run.daily.date!==today;state.daily[run.daily.date][run.daily.mode]=run;}
 // Bonus je ursprünglichem Training genau einmal; Nachholen verändert keinen Zieltag.
 if(!run.daily.replay&&!state.dailyRewards.includes(key)){state.xp+=50;state.dailyRewards.push(key);}
 return true;
}
export function completedDays(state){return [...new Set(Object.values(state.daily).flatMap(d=>[d.mc,d.calc]).filter(r=>r.finished&&r.status!=='übersprungen'&&(r.goalDate===undefined?r.completedOn:r.goalDate)).map(r=>r.goalDate===undefined?r.completedOn:r.goalDate))].sort();}
export const goalReached=(state,date=dayKey())=>completedDays(state).includes(date);
export function dailyStreak(state,now=new Date()){const days=new Set(completedDays(state));const d=new Date(now);if(!days.has(dayKey(d)))d.setDate(d.getDate()-1);let n=0;while(days.has(dayKey(d))){n++;d.setDate(d.getDate()-1);}return n;}
export function replayRun(run){return createRun(structuredClone(run.items),Date.now(),{...run.daily,replay:true});}
export function syncDaily(state,run){if(run?.daily&&!run.daily.replay){normalizeRun(run);if(run.status==='offen'&&run.inputs.some(Boolean))run.status='begonnen';state.daily[run.daily.date][run.daily.mode]=run;}}
