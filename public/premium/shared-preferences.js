// Per-symbol accessibility preferences shared by the adventure and sanctuary.
export function preferenceKey(profile='main'){return 'odisea.preferences.v1.'+(['main','dolphin','owl','olive'].includes(profile)?profile:'main');}
export function activeProfile(storage){try{const p=storage?.getItem('odisea.active-player');return ['main','dolphin','owl','olive'].includes(p)?p:'main';}catch{return 'main';}}
const clean=p=>({reduced:p?.reduced===true,contrast:p?.contrast===true,large:p?.large===true,audio:p?.audio===true});
export function readPreferences(storage,profile,fallback={}){try{const value=storage?.getItem(preferenceKey(profile));if(value)return clean(JSON.parse(value));const journey=JSON.parse(storage?.getItem('odisea.journey.v2'+(profile==='main'?'':'.'+profile))||'null');return clean(journey?.prefs||fallback);}catch{return clean(fallback);}}
export function writePreferences(storage,profile,prefs){try{storage?.setItem(preferenceKey(profile),JSON.stringify(clean(prefs)));return !!storage;}catch{return false;}}
