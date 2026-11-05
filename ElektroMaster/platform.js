// Verfügbare Module haben Datenadapter; geplante Bereiche sind keine Links.
export const modules=[
{id:'electro',title:'Elektrotechnik',description:'Grundlagen, Schaltungen, Maschinen und industrielle Praxis',available:true,stateKey:'root',content:'./content.js',knowledge:'./knowledge.js'},
{id:'business',title:'Betriebswirtschaft',description:'Kostenrechnung und Wirtschaftlichkeit',available:false,stateKey:'moduleData.business'},
{id:'planning',title:'Planung & Organisation',description:'Kapazitäten, Projekte und Ressourcen',available:false,stateKey:'moduleData.planning'},
{id:'people',title:'Personalführung',description:'Führung, Kommunikation und Entwicklung',available:false,stateKey:'moduleData.people'},
{id:'quality',title:'Qualitätsmanagement',description:'Qualitätsplanung, Kennzahlen und Verbesserung',available:false,stateKey:'moduleData.quality'}
];
export const activeModule=modules[0];
