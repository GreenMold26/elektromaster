import assert from 'node:assert/strict';
import {fresh,validateBackup,loadState,STORAGE_KEY} from './state.js';
import {ensureDay,startDaily,skipDaily,finishDaily,goalReached,dailyStreak,trainingHistory,completedDays,replayRun,trainingId} from './daily.js';
const at=d=>new Date(d+'T12:00:00');
function fill(r){r.items.forEach((q,i)=>{r.inputs[i]=q.options?{choice:0}:{values:q.fields.map(()=>'-1'),units:q.fields.map(f=>f.unit)};r.results[i]={points:0,total:q.fields?.length||1,marks:Array(q.fields?.length||1).fill(false)};});}
const s=fresh(),old='2026-11-01',today='2026-11-27';ensureDay(s,old);ensureDay(s,today);
assert.equal(s.daily[old].mc.status,'offen');assert.equal(s.daily[old].mc.trainingId,trainingId(old,'mc'));
let r=startDaily(s,old,'mc');s.active=r;r.inputs[0]={choice:2};s.xp=123;s.stats.example={attempts:1};
const partial=structuredClone(r.inputs),stats=structuredClone(s.stats),current=JSON.stringify(s.daily[today]);
assert.equal(skipDaily(s,today,'mc',today),false);assert.equal(skipDaily(s,old,'mc',today),true);
assert.equal(r.status,'übersprungen');assert.equal(r.finished,false);assert.equal(s.active,null);assert.equal(s.xp,123);assert.deepEqual(s.stats,stats);assert.deepEqual(r.inputs,partial);assert.equal(JSON.stringify(s.daily[today]),current);assert.equal(goalReached(s,old),false);
fill(r);assert.equal(finishDaily(s,r,at(today)),false);assert.equal(s.xp,123);
// Separate current progress survives any number of switches and skip/resume cycles.
const c=startDaily(s,today,'calc');c.inputs[0]={values:['12,5'],units:[c.items[0].fields[0].unit]};s.active=c;
r=startDaily(s,old,'mc');s.active=r;assert.equal(r.status,'begonnen');assert.equal(s.daily[today].calc.inputs[0].values[0],'12,5');
assert.equal(finishDaily(s,r,at(today)),true);assert.equal(r.madeUp,true);assert.equal(r.daily.date,old);assert.equal(r.goalDate,null);assert.equal(s.xp,173);assert.equal(goalReached(s,old),false);assert.equal(goalReached(s,today),false);
finishDaily(s,r,at('2026-11-28'));assert.equal(s.xp,173);assert.equal(skipDaily(s,old,'mc',today),false);
const replay=replayRun(r);fill(replay);finishDaily(s,replay,at(today));assert.equal(s.xp,173);
fill(c);finishDaily(s,c,at(today));assert.equal(goalReached(s,today),true);assert.equal(dailyStreak(s,at(today)),1);
const rows=trainingHistory(s,today);assert.equal(rows.length,27);assert.equal(rows.find(x=>x.date==='2026-11-15').missed,true);assert.equal(rows.find(x=>x.date===old).missed,true);assert.equal(rows.find(x=>x.date===old).runs.mc.madeUp,true);
// A genuine V2 backup: no new metadata, historical overnight credit remains frozen.
const legacy=fresh();ensureDay(legacy,old);fill(legacy.daily[old].mc);let legacyRun=legacy.daily[old].mc;legacyRun.finished=true;legacyRun.completedOn='2026-11-02';legacyRun.completedAt=at('2026-11-02').getTime();legacy.dailyRewards=['2026-11-02:mc'];legacy.xp=287;
for(const run of Object.values(legacy.daily[old])){delete run.status;delete run.trainingId;delete run.goalDate;}
legacy.active=legacy.daily[old].calc;legacy.active.inputs[0]={values:['8'],units:[legacy.active.items[0].fields[0].unit]};
const raw=JSON.stringify(legacy),migrated=loadState({getItem:k=>k===STORAGE_KEY?raw:null}).state;
assert.equal(migrated.xp,287);assert.deepEqual(completedDays(migrated),['2026-11-02']);assert.equal(migrated.daily[old].mc.status,'abgeschlossen');assert.equal(migrated.daily[old].calc.status,'begonnen');assert.equal(migrated.active,migrated.daily[old].calc);
const restored=validateBackup(JSON.parse(JSON.stringify(migrated)),{local:true});assert.equal(restored.xp,287);assert.deepEqual(completedDays(restored),['2026-11-02']);
assert.equal(finishDaily(restored,restored.daily[old].mc,at(today)),true);assert.equal(restored.xp,287);
const bad=structuredClone(restored);bad.daily[old].mc.status='übersprungen';assert.throws(()=>validateBackup(bad));
const badId=structuredClone(restored);badId.daily[old].mc.trainingId='wrong';assert.throws(()=>validateBackup(badId));
// Skips survive file import, without reviving a stale active copy.
skipDaily(restored,old,'calc',today);const stale=structuredClone(restored);stale.active=legacy.active;
const reopened=validateBackup(stale,{local:true});assert.equal(reopened.active,null);assert.equal(reopened.daily[old].calc.status,'übersprungen');assert.equal(reopened.daily[old].calc.inputs[0].values[0],'8');
for(const [dates,end] of [[['2026-10-24','2026-10-26'],'2026-10-26'],[['2026-03-28','2026-03-30'],'2026-03-30']]){const x=fresh();dates.forEach(d=>ensureDay(x,d));assert.equal(trainingHistory(x,end).length,3);}
console.log('Überspringen bestanden: Zustände, IDs, XP-Erhalt, Nachholen, unveränderliche Zielhistorie, 26 Tage Pause, Migration, Backup und Zeitumstellung.');
