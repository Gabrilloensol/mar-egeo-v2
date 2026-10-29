export const sculptureThemes=[
 {id:'starter',label:'Para empezar · 6 figuras',ids:['zeus','poseidon','atenea','demeter','hefesto','hestia']},
 {id:'sky-sea',label:'Cielo y mar',ids:['zeus','hera','poseidon']},
 {id:'city-arts',label:'Ciudad, oficios y artes',ids:['atenea','apolo','ares','hefesto','hermes']},
 {id:'life-nature',label:'Vida cotidiana y naturaleza',ids:['demeter','artemisa','afrodita','dioniso','hestia']},
 {id:'underworld',label:'Relatos del mundo subterráneo',ids:['hades','persefone']},
 {id:'all',label:'Toda la colección · 15 figuras',ids:null}
];
export function themeForSculpture(id){return sculptureThemes.find(t=>t.ids?.includes(id))?.id||'all';}
export function sculpturesInTheme(gods,id){const theme=sculptureThemes.find(t=>t.id===id);return theme?.ids?gods.filter(g=>theme.ids.includes(g.id)):gods;}
