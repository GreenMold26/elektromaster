// Ausschließlich lokale SVGs; Beschriftungen stammen aus gegebenen Aufgabendaten.
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n=x=>new Intl.NumberFormat('de-DE',{maximumFractionDigits:3}).format(x);
const text=(x,y,s)=>'<text x="'+x+'" y="'+y+'">'+e(s)+'</text>';
const wire=d=>'<path d="'+d+'" class="wire"/>';
const resistor=(x,y,label)=>'<rect x="'+x+'" y="'+y+'" width="70" height="24" class="component"/>'+text(x,y-10,label);
const vertical=(x,y,label)=>'<rect x="'+x+'" y="'+y+'" width="24" height="56" class="component"/>'+text(x+34,y+32,label);
const node=(x,y)=>'<circle cx="'+x+'" cy="'+y+'" r="4" class="junction"/>';
const source=(x,y,label,ac=false)=>'<circle cx="'+x+'" cy="'+y+'" r="25" class="component"/>'+text(x-8,y+6,ac?'~':'+')+text(x-50,y+53,label);
const frame=(title,body,caption)=>'<figure class="schematic"><svg viewBox="0 0 600 280" role="img" aria-label="'+e(title)+'"><title>'+e(title)+'</title>'+body+'</svg><figcaption>'+e(caption||title)+' · Bei Bedarf seitlich scrollen.</figcaption></figure>';
export const diagramByTopic={f0:'ohm',f1:'ohm',f4:'series',f5:'parallel',f6:'divider',f7:'current-source',f11:'capacitor',f12:'rc',f14:'coil',f17:'sine',f18:'coil',f19:'capacitor',f20:'rl',f25:'motor',f26:'star',f27:'delta',f28:'comp',f29:'transformer',f30:'transformer',f31:'motor',f32:'motor',f33:'motor',f34:'drop',c1:'parallel',c2:'mixed',c4:'transformer',c5:'phasor',c6:'transformer',c7:'transformer',c8:'transformer',c9:'dc-motor',c10:'motor',c11:'star-delta',c12:'drive',c13:'protection',c14:'protection',c15:'protection',c16:'drop',c17:'meter',c18:'sensor',c19:'contactor',c20:'plc',c21:'control',c22:'pwm',c23:'distribution',c24:'sensor','t-ratings':'transformer'};
export function diagramForTask(q){if(q.kind==='calc'){const map={ohm:'ohm',power:'dc-load',parallel:'mixed',rc:'rc',xl:'coil',xc:'capacitor',rl:'rl',motor:'motor',transformer:'transformer',slip:'motor',comp:'comp',drop:'drop',sensor:'sensor',turns:'transformer',star:'star-delta',uk:'transformer'};return diagram(map[q.id.replace('calc-','')],q.values||{});}return diagram(diagramByTopic[q.lesson],{});}
export function diagramForArticle(id){return diagram(diagramByTopic[id],{});}
export function diagram(kind,v={}){
 if(!kind)return '';
 const val=(key,unit,fallback)=>v[key]!==undefined?n(v[key])+' '+unit:fallback;
 if(['ohm','series','divider'].includes(kind)){
 const body=wire('M80 110 V65 H215 M285 65 H480 V220 H80 V160')+source(80,135,val('U','V','U'))+resistor(215,53,val('R','Ω',kind==='ohm'?'R':'R₁'))+(kind==='ohm'?text(330,100,'I →'):wire('M480 65 V112 M480 168 V220')+vertical(468,112,'R₂'))+text(200,250,kind==='ohm'?'Unverzweigter Strompfad':'Gleicher Strom durch beide Widerstände');
 // Bei zwei Widerständen den Draht durch R₂ unterbrechen.
 return frame(kind==='ohm'?'Ohmscher Verbraucher':'Reihenschaltung',kind==='ohm'?body:body.replace('H480 V220 H80','H480 M480 220 H80'),kind==='divider'?'Spannungsteiler: U₂ wird über R₂ abgegriffen':undefined);
 }
 if(['parallel','mixed','current-source'].includes(kind)){
 const mixed=kind==='mixed';let body=wire('M70 110 V55 H155 M225 55 H490 V210 H70 V160')+source(70,135,val('U','V','U'))+wire('M320 55 V91 M320 147 V210 M490 55 V91 M490 147 V210')+vertical(308,91,val('R1','Ω','R₁'))+vertical(478,91,val('R2','Ω','R₂'))+node(320,55)+node(320,210);
 body=body.replace('H490 V210 H70','H490 M490 210 H70');
 if(kind==='current-source')body=body.replace('>+</text>','>↑</text>').replace('>U</text>','>I</text>');
 body+=mixed?resistor(155,43,val('R3','Ω','R₃')):wire('M155 55 H225');
 return frame(mixed?'Gemischtes Widerstandsnetz':kind==='current-source'?'Stromquelle mit Parallelzweigen':'Parallelschaltung',body,mixed?'R₃ in Reihe zur Parallelgruppe R₁ ∥ R₂':'Beide Zweige liegen an denselben zwei Knoten');
 }
 if(['capacitor','coil','rc','rl'].includes(kind)){
 const cap=kind==='capacitor'||kind==='rc';let body=wire('M70 110 V60 H180 M250 60 H430 V110 M430 160 V220 H70 V160')+source(70,135,val('U','V','U'),kind!=='rc');
 body+=['rc','rl'].includes(kind)?resistor(180,48,val('R','Ω','R')):wire('M180 60 H250');
 body+=cap?wire('M395 110 H465 M395 160 H465')+text(475,142,val('C','µF','C')):wire('M430 110 Q465 116 430 122 Q465 128 430 134 Q465 140 430 146 Q465 153 430 160')+text(475,142,val('L','mH',v.X!==undefined?'X_L = '+n(v.X)+' Ω':'L'));
 return frame(cap?'Kondensatorschaltung':'Spulenschaltung',body+text(160,257,v.f?'Frequenz: '+n(v.f)+' Hz':kind==='rc'?'Aufladung über R':kind==='rl'?'Reihenschaltung aus R und L':'Ideales Bauteilmodell'));
 }
 if(['star','delta','star-delta'].includes(kind)){
 const star=wire('M45 55 H110 L180 125 M45 140 H110 M45 225 H110 L180 155')+wire('M110 140 H180 M180 125 V155')+node(180,140)+text(20,40,'L1')+text(20,125,'L2')+text(20,210,'L3')+
 '<g transform="translate(145 90) rotate(45)"><rect x="-25" y="-10" width="50" height="20" class="component"/></g><rect x="120" y="130" width="40" height="20" class="component"/><g transform="translate(145 190) rotate(-45)"><rect x="-25" y="-10" width="50" height="20" class="component"/></g>'+text(190,145,'Sternpunkt');
 const delta=wire('M400 55 L330 210 H530 Z')+node(400,55)+node(330,210)+node(530,210)+text(390,40,'L1')+text(295,235,'L2')+text(530,235,'L3')+'<g transform="translate(367 128) rotate(-66)"><rect x="-23" y="-11" width="46" height="22" class="component"/></g><g transform="translate(465 132) rotate(50)"><rect x="-23" y="-11" width="46" height="22" class="component"/></g><rect x="407" y="199" width="46" height="22" class="component"/>';
 return frame('Stern- und Dreieckanordnung',star+delta+text(80,265,val('U','V','U_L')+' · je Strang '+val('R','Ω','R_Str')),'Links Stern, rechts Dreieck · Widerstandssymbole überdecken die Leitung an ihrem Einbauort');
 }
 if(kind==='transformer'){
 let body=wire('M55 65 H180 V85 M180 185 V215 H55 M545 65 H380 V85 M380 185 V215 H545');
 body+=wire('M180 85 Q220 95 180 105 Q220 115 180 125 Q220 135 180 145 Q220 155 180 165 Q220 175 180 185 M380 85 Q340 95 380 105 Q340 115 380 125 Q340 135 380 145 Q340 155 380 165 Q340 175 380 185 M267 60 V225 M287 60 V225');
 body+=text(60,42,val('U1','V','Primär'))+text(385,42,'Sekundär')+text(95,248,val('N1','Windungen','N₁'))+text(350,248,val('N2','Windungen','N₂'));
 if(v.SN)body+=text(225,25,'S_N = '+n(v.SN/1000)+' kVA');
 if(v.uk)body+=text(225,25,'u_k = '+n(v.uk)+' %');
 return frame('Transformator mit zwei getrennten Wicklungen',body,'Prinzip: magnetische Kopplung über den Kern, keine leitende Verbindung der Wicklungen');
 }
 if(['motor','dc-motor','drive'].includes(kind)){
 let body=wire('M40 110 H220 M40 135 H220 M40 160 H220 M380 135 H530')+'<circle cx="300" cy="135" r="80" class="component"/>'+text(278,125,'M')+text(273,160,kind==='dc-motor'?'DC':'3~')+text(420,120,'Welle →')+text(40,48,val('U','V',kind==='dc-motor'?'Gleichstrom':'Drehstrom'))+text(40,85,val('I','A','I_L'))+text(400,170,val('n','1/min','n'))+text(190,250,v.cos?'cos φ = '+n(v.cos)+' · η = '+n(v.eta*100)+' %':v.p?'p = '+v.p+' · f = '+v.f+' Hz':'Elektrische → mechanische Leistung');
 if(kind==='dc-motor')body=body.replace('M40 110 H220 M40 135 H220 M40 160 H220','M40 110 H220 M40 160 H220');
 if(kind==='drive')body=body+'<rect x="45" y="92" width="110" height="85" class="component"/>'+text(60,130,'Umrichter')+text(66,157,'f variabel');
 return frame('Elektrischer Antrieb',body);
 }
 if(['sensor','plc','control','distribution','protection','meter','drop','comp','pwm','dc-load'].includes(kind)){
 const labels={'dc-load':['DC-Quelle','Verbraucher','Energieumsatz'],sensor:['Messgröße','Sensor','SPS / Anzeige'],plc:['Eingänge','Programm','Ausgänge'],control:['Vergleich','Regler','Strecke'],distribution:['Einspeisung','Verteilung','Abgang'],protection:['Quelle','Schutzorgan','Verbraucher'],meter:['Messobjekt','Messgerät','Messwert'],drop:['DC-Quelle','Hin/Rückleiter','Last'],comp:['Netz','Sammelschiene','Induktive Last'],pwm:['DC-Zwischenkreis','Schalter','Last']}[kind];
 let body=labels.map((label,i)=>'<rect x="'+(20+i*200)+'" y="85" width="160" height="65" rx="7" class="component"/>'+text(30+i*200,122,label)).join('')+wire('M180 118 H220 M380 118 H420');
 if(kind==='control')body+=wire('M500 150 V210 H100 V150')+text(205,235,'Istwert-Rückführung');
 if(kind==='comp')body+=wire('M300 150 V190')+'<rect x="220" y="190" width="160" height="50" rx="6" class="component"/>'+text(232,222,'Kompensation');
 if(kind==='dc-load')body+=text(25,55,val('U','V','U'))+text(225,55,val('I','A','I'))+text(220,200,val('t','h','Betriebszeit'));
 if(kind==='drop')body+=text(25,55,val('U','V','U'))+text(200,55,val('l','m','l')+' · '+val('A','mm²','A'))+text(210,200,'Hin- und Rückleiter: 2 · l');
 if(kind==='sensor')body+=text(50,55,v.max?'Bereich: 0–'+n(v.max)+' bar':'Physikalische Größe')+text(220,200,v.I?'Messsignal: '+n(v.I)+' mA':'4–20 mA');
 if(kind==='pwm')body+=wire('M60 240 H100 V190 H160 V240 H220 V190 H280 V240 H340');
 if(kind==='meter')body+=text(50,210,'Spannung: parallel · Strom: in Reihe');
 return frame('Funktionsschema: '+labels.join(' → '),body,'Funktionsschema – kein ausführungsreifer Verdrahtungsplan');
 }
 if(kind==='contactor'){return frame('Selbsthaltung eines Schützes',wire('M40 65 H120 M155 65 H220 V110 M220 110 H260 M295 110 H380 V65 H430 M480 65 H550 V235 H40 V65 M220 65 V35 H260 M295 35 H380 V65')+wire('M120 48 V82 M155 48 V82 M120 80 L155 50 M260 20 V50 M295 20 V50 M260 95 V125 M295 95 V125')+'<rect x="430" y="48" width="50" height="34" class="component"/>'+text(95,115,'Stop (Öffner)')+text(245,16,'Start')+text(245,155,'K1 (Schließer)')+text(430,110,'K1-Spule')+node(220,65)+node(380,65),'Start und K1-Hilfskontakt parallel; Stop und Spule in Reihe. Vereinfachtes Funktionsprinzip.');}
 if(kind==='phasor')return frame('Zeigerdiagramm einer RL-Reihenschaltung',wire('M80 220 H390 V60 M80 220 L390 60')+text(200,250,'U_R · Richtung I')+text(410,150,'U_L')+text(200,120,'U')+'<path d="M140 220 A60 60 0 0 0 133 193" class="wire"/>'+text(150,207,'φ'));
 if(kind==='sine')return frame('Sinusförmige Wechselgröße',wire('M30 140 H565 M70 245 V30')+'<path d="M70 140 C110 0 160 0 205 140 S300 280 345 140 S440 0 485 140" class="wire"/>'+text(80,25,'u(t)')+text(540,165,'t'),'Prinzipdarstellung des zeitlichen Verlaufs; nicht maßstäblich');
 return '';
}
