// A new, versioned journey. Legacy saves are read, never overwritten or graded.
export const JOURNEY_KEY='odisea.journey.v2';
export const chapterIds=['sea','city','clues'];
export const legacyKeys=['odisea-transform-v06-record','odisea-transform-v07-polis-record','odisea-transform-v08-sources-record'];
const object=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
const list=(v,allowed)=>[...new Set(Array.isArray(v)?v:[])].filter(x=>allowed.includes(x));
export function fresh(){return {version:2,view:'map',chapter:'sea',step:0,completed:[],sea:{route:null,supplies:[],response:null,reason:null},city:{placed:[],roads:[],reason:null,expanded:false},clues:{found:[],answer:null,limit:null},records:{},replays:{},extensions:{source:null,similarity:null,difference:null},notes:{},prefs:{reduced:false,contrast:false,audio:false,large:false},legacy:[],updatedAt:null};}
export function normalizeJourney(raw){
 const r=object(raw),s=object(r.sea),c=object(r.city),e=object(r.clues),p=object(r.prefs),n=fresh();
 n.chapter=chapterIds.includes(r.chapter)?r.chapter:'sea';n.view=['map','play','book','teacher','settings'].includes(r.view)?r.view:'map';
 n.step=Number.isInteger(r.step)?Math.max(0,Math.min(r.step,4)):0;
 n.completed=list(r.completed,chapterIds);n.legacy=list(r.legacy,chapterIds);
 n.replays=Object.fromEntries(n.completed.filter(id=>Number.isInteger(r.replays?.[id])).map(id=>[id,Math.max(0,Math.min(3,r.replays[id]))]));
 n.sea={route:['islands','direct'].includes(s.route)?s.route:null,supplies:list(s.supplies,['water','sail','trade']).slice(0,2),response:['shelter','adjust'].includes(s.response)?s.response:null,reason:['ports','wind'].includes(s.reason)?s.reason:null};
 if(n.sea.route==='direct'&&n.sea.response==='shelter')n.sea.response=null;
 n.city={placed:list(c.placed,['port','homes','farms','agora','temple','theatre']),roads:list(c.roads,['port-homes','farms-homes','agora-homes','temple-homes','theatre-homes']),reason:['roads','walls'].includes(c.reason)?c.reason:null,expanded:c.expanded===true};
 n.clues={found:list(e.found,['ship','amphora']),answer:['exchange','all'].includes(e.answer)?e.answer:null,limit:['date','exact'].includes(e.limit)?e.limit:null};
 n.notes=Object.fromEntries(chapterIds.filter(id=>typeof r.notes?.[id]==='string').map(id=>[id,r.notes[id].slice(0,600)]));
 n.prefs={reduced:p.reduced===true,contrast:p.contrast===true,audio:p.audio===true,large:p.large===true};
 n.updatedAt=typeof r.updatedAt==='string'?r.updatedAt:null;
 n.extensions={source:['object','drawing'].includes(r.extensions?.source)?r.extensions.source:null,similarity:['food','same'].includes(r.extensions?.similarity)?r.extensions.similarity:null,difference:['motor','identical'].includes(r.extensions?.difference)?r.extensions.difference:null};
 // Optional snapshots are independent of a replay in progress. Old saves stay valid.
 for(const id of n.completed){
  const rawRecord=object(r.records?.[id]);
  if(!Object.keys(rawRecord).length)continue;
  const candidate=normalizeJourney({chapter:id,completed:chapterIds,[id]:rawRecord});
  if(readyToFinish(candidate)){
   n.records[id]=candidate[id];
   if(id==='city')n.records[id].portCargo=['grain','oil'].includes(rawRecord.portCargo)?rawRecord.portCargo:null;
  }
 }
 // Never restore a screen whose prerequisites were lost or corrupted.
 if(n.view==='play'){if(!(n.step===4&&n.records[n.chapter]))n.step=Math.min(n.step,maxStep(n));if(!isUnlocked(n,n.chapter))n.view='map';}
 return n;
}
export function maxStep(s){
 const last=s.completed.includes(s.chapter)?4:3;
 if(s.chapter==='sea'){if(!s.sea.route)return 0;if(s.sea.supplies.length!==2)return 1;if(!s.sea.response||(s.sea.route==='direct'&&s.sea.response==='shelter'))return 2;return last;}
 if(s.chapter==='city'){if(!['port','homes','farms'].every(x=>s.city.placed.includes(x)))return 0;if(!['port-homes','farms-homes'].every(x=>s.city.roads.includes(x)))return 1;return last;}
 if(s.clues.found.length<2)return 0;if(s.clues.answer!=='exchange')return 1;if(s.clues.limit!=='date')return 2;return last;
}
export function isUnlocked(s,id){const i=chapterIds.indexOf(id);return i===0||i>0&&chapterIds.slice(0,i).every(x=>s.completed.includes(x)||s.legacy.includes(x));}
export function readyToFinish(s){
 if(!isUnlocked(s,s.chapter))return false;
 if(s.chapter==='sea')return !!s.sea.route&&s.sea.supplies.length===2&&!!s.sea.response&&!(s.sea.route==='direct'&&s.sea.response==='shelter')&&s.sea.reason===(s.sea.route==='islands'?'ports':'wind');
 if(s.chapter==='city')return ['port','homes','farms'].every(x=>s.city.placed.includes(x))&&['port-homes','farms-homes'].every(x=>s.city.roads.includes(x))&&s.city.reason==='roads';
 return s.clues.found.length===2&&s.clues.answer==='exchange'&&s.clues.limit==='date';
}
export function finish(s){
 if(!readyToFinish(s))return s;
 const completed=[...new Set([...s.completed,s.chapter])];
 const record=normalizeJourney({...s,completed,records:{}})[s.chapter];
 if(s.chapter==='city')record.portCargo=portCargo(s);
 const replays={...s.replays};delete replays[s.chapter];
 return {...s,step:4,completed,replays,records:{...s.records,[s.chapter]:record}};
}
export function completedVoyage(s){return s.records?.sea||s.sea;}
export function portCargo(s){const sea=completedVoyage(s);return sea.route==='islands'&&sea.response==='shelter'&&sea.supplies.includes('trade')?'grain':'oil';}
export function voyageOutcome(s){
 const a=s.sea,has=x=>a.supplies.includes(x);
 if(a.response==='shelter')return {title:'Una pausa en el puerto',text:has('trade')?'Guardaste espacio: intercambias aceite por grano en la escala.':'El puerto permite esperar a que baje el viento y descansar.',effect:'shelter',resource:has('trade')?'El espacio libre permite recibir grano.':has('water')?'El agua acompaña a la tripulación durante la espera.':'La tripulación encuentra agua en el puerto.'};
 return {title:'La vela se adapta al viento',text:has('sail')?'La vela se daña. La vela de repuesto permite continuar el viaje.':'Recoges parte de la vela y avanzas con calma. El viaje tarda más.',effect:has('sail')?'sail':'slow',resource:has('water')?'Llevaste agua para un tramo sin paradas.':'La tripulación hace una parada al llegar para buscar agua.'};
}
export function readLegacy(storage){return legacyKeys.flatMap((key,i)=>{try{const r=JSON.parse(storage?.getItem(key)||'null');return r&&(r.completedAt||r.phase==='complete')?[chapterIds[i]]:[];}catch{return [];}});}
export function loadJourney(storage,key=JOURNEY_KEY){let s=fresh();try{const raw=storage?.getItem(key);s=normalizeJourney(raw?JSON.parse(raw):{});}catch{}if(key===JOURNEY_KEY)s.legacy=readLegacy(storage);return s;}
export function saveJourney(storage,state,key=JOURNEY_KEY){try{storage.setItem(key,JSON.stringify({...normalizeJourney(state),updatedAt:new Date().toISOString()}));return true;}catch{return false;}}
export function exportJourney(s){return JSON.stringify({format:'odisea-journey',version:2,state:normalizeJourney(s)},null,2);}
export function parseJourneyBackup(text){if(text.length>200000)throw Error('El archivo es demasiado grande.');const r=JSON.parse(text);if(r?.format!=='odisea-journey'||r.version!==2||r.state?.version!==2)throw Error('Esta copia no pertenece a esta aventura.');return normalizeJourney(r.state);}
export function restoreJourney(storage,text,key=JOURNEY_KEY){const state=parseJourneyBackup(text);try{const old=storage.getItem(key);if(old)storage.setItem(key+'.before-import',old);storage.setItem(key,JSON.stringify(state));return state;}catch{throw Error('No hay espacio para guardar la copia. Tu partida actual no se reemplazó.');}}
