import assert from 'node:assert/strict';
import {formulas} from './content.js';
// Auswertung der tatsächlich angezeigten Formeln mit einem kleinen,
// nicht ausführenden Ausdrucksparser. Keine eval-Ausführung von Inhalten.
function evaluate(source,env){
 let pos=0;const keys=Object.keys(env).sort((a,b)=>b.length-a.length);
 const skip=()=>{while(source[pos]===' ')pos++;};
 function atom(){skip();let value;
  if(source[pos]==='√'){pos++;return Math.sqrt(atom());}
  if(source[pos]==='½'){pos++;value=.5;}
  else if(source[pos]==='π'){pos++;value=Math.PI;}
  else if(source[pos]==='('){pos++;value=expr();skip();assert.equal(source[pos++],')');}
  else if(['sin','cos','tan'].some(fn=>source.startsWith(fn,pos))){const fn=source.slice(pos,pos+3);pos+=3;return Math[fn](atom());}
  else{const key=keys.find(k=>source.startsWith(k,pos));if(key){pos+=key.length;value=env[key];}else{const m=source.slice(pos).match(/^\d+(?:\.\d+)?/);assert.ok(m,'Token bei '+source.slice(pos));pos+=m[0].length;value=Number(m[0]);}}
  skip();if(source[pos]==='²'){pos++;value*=value;}return value;
 }
 function term(){let v=atom();while(true){skip();if(source[pos]==='·'){pos++;v*=atom();}else if(source[pos]==='/'){pos++;v/=atom();}else break;}return v;}
 function expr(){let v=term();while(true){skip();if(source[pos]==='+'){pos++;v+=term();}else if(source[pos]==='−'){pos++;v-=term();}else break;}return v;}
 const v=expr();skip();assert.equal(pos,source.length,'Vollständige Formel gelesen: '+source);return v;
}
const envs=[
t=>({R:137*t,I:2.3/t,U:137*t*2.3/t}),
t=>({U:24*t,I:1.7,P:24*t*1.7}),
t=>({P:231*t,t:340,W:231*t*340}),
t=>({'P₁':1000*t,'P₂':830*t,'η':.83}),
t=>({'R₁':137*t,'R₂':213,R:137*t+213}),
t=>({'R₁':137*t,'R₂':213,R:137*t*213/(137*t+213)}),
t=>({U:24*t,'R₁':137,'R₂':213,'U₂':24*t*213/350}),
t=>({I:4*t,'R₁':137,'R₂':213,'I₁':4*t*213/350}),
t=>({G:1/(137*t),R:137*t}),
t=>({R:.0178*137/(2.5*t),'ρ':.0178,l:137,A:2.5*t}),
t=>({R:100*(1+.004*30*t),'R₀':100,'α':.004,'ΔT':30*t}),
t=>({Q:.00022*24*t,C:.00022,U:24*t}),
t=>({'τ':1370*t*.00022,R:1370*t,C:.00022}),
t=>({'Φ':.43*.012*t,B:.43,A:.012*t}),
t=>({W:.5*.23*(2.4*t)**2,L:.23,I:2.4*t}),
t=>({f:50*t,T:1/(50*t)}),
t=>({'ω':2*Math.PI*50*t,f:50*t}),
t=>({'Û':Math.sqrt(2)*230*t,U:230*t}),
t=>({X_L:2*Math.PI*50*.17*t,f:50,L:.17*t}),
t=>({X_C:1/(2*Math.PI*50*.00022*t),f:50,C:.00022*t}),
t=>({Z:Math.hypot(31*t,47),R:31*t,X_L:47}),
t=>({P:230*7*t*Math.cos(.6),U:230,I:7*t,'φ':.6}),
t=>({Q:230*7*t*Math.sin(.6),U:230,I:7*t,'φ':.6}),
t=>({S:230*7*t,U:230,I:7*t}),
t=>({'λ':.83,P:830*t,S:1000*t}),
t=>({P:Math.sqrt(3)*400*7*t*Math.cos(.6),U_L:400,I_L:7*t,'φ':.6}),
t=>({U_L:400*t,U_Str:400*t/Math.sqrt(3)}),
t=>({I_L:7*t*Math.sqrt(3),I_Str:7*t}),
t=>({Q_C:13000*t*(Math.tan(.65)-Math.tan(.3)),P:13000*t,'φ₁':.65,'φ₂':.3}),
t=>({'U₁':230,'U₂':230*113*t/1000,'N₁':1000,'N₂':113*t}),
t=>({P_Cu:(.3*t)**2*631,'β':.3*t,'P_Cu,N':631}),
t=>({n_s:60*50*t/3,f:50*t,p:3}),
t=>({s:.025*t,n_s:1500,n:1500*(1-.025*t)}),
t=>({M:60*7500*t/(2*Math.PI*1450),P:7500*t,n:1450}),
t=>({'ΔU':2*.0178*23*7/(2.5*t),'ρ':.0178,l:23,I:7,A:2.5*t})
];
let tested=0;
for(let i=0;i<formulas.length;i++)for(let k=0;k<20;k++){const env=envs[i](1.1+k*.07);for(const text of [formulas[i].formula,formulas[i].rearranged]){const [a,b]=text.split('=');const x=evaluate(a.trim(),env),y=evaluate(b.trim(),env);assert.ok(Math.abs(x-y)<Math.max(1e-9,Math.abs(x)*1e-10),formulas[i].title+': '+text);tested++;}}
console.log(tested+' Prüfungen der angezeigten Formeln und Umstellungen bestanden.');
