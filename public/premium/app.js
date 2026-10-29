import {activeProfile,readPreferences,writePreferences,preferenceKey} from './shared-preferences.js';
import {setupAdventureReturn} from './adventure-return.js';
import {gods,sites,sources,learningGuides,sitePresentation} from './content.js';
import {load,save,answer} from './state.js';
import {icon} from './icons.js';
import {uiIcon,decorateUiIcons} from './ui-icons.js';
import {setupJournal} from './journal.js';
import {setupGodGallery} from './god-gallery.js';
const $=id=>document.getElementById(id);
decorateUiIcons();
let storage;try{storage=localStorage;}catch{storage=null;}
let state=load(storage),world=null,selectedSite=null,siteVisualIndex=0,selectedGod='poseidon',filter='Todos',mode='inicio';
const preferenceProfile=activeProfile(storage);let sharedPrefs;
let celebrationDismissed=state.visited.length===4;
state.learned=state.learned.filter(id=>gods.some(g=>g.id===id));
try{if(!storage?.getItem('odisea.sanctuary.v1'))state.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;}catch{state.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;}
sharedPrefs=readPreferences(storage,preferenceProfile,{reduced:state.reduced,large:state.textSize>100});state.reduced=sharedPrefs.reduced;if(sharedPrefs.large&&state.textSize===100)state.textSize=130;else if(!sharedPrefs.large)state.textSize=100;document.body.classList.toggle('contrast',sharedPrefs.contrast);
function persist(){const ok=save(storage,state);$('save-status').textContent=ok?'Los hallazgos están guardados en este navegador.':'No se pudo guardar. Puedes exportar el cuaderno para conservar tus hallazgos.';return ok;}
function announce(t){$('live').textContent=t;}
function showDialog(id){document.querySelectorAll('dialog[open]').forEach(other=>{if(other.id!==id)other.close();});const d=$(id);if(!d.open)d.showModal();world?.pause(true);}
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',()=>{world?.pause(Boolean(document.querySelector('dialog[open]')));}));
function explore(){mode='explorar';document.body.dataset.mode=mode;$('intro').hidden=true;$('exploration').hidden=false;$('markers').hidden=document.body.dataset.render!=='ready';world?.overview();updateProgress();$('stations').querySelector('button')?.focus();}
function home(){mode='inicio';document.body.dataset.mode=mode;$('intro').hidden=false;$('exploration').hidden=true;$('markers').hidden=true;closeSite();announce('');world?.home();$('start').focus();}
for(const id of ['start','nav-explore'])$(id).onclick=explore;
$('home').onclick=home;
$('dismiss-complete').onclick=()=>{celebrationDismissed=true;updateProgress();$('stations').querySelector('button')?.focus();};
for(const id of ['nav-codex','intro-codex','complete-codex'])$(id).onclick=()=>openCodex();
$('nav-campaign').onclick=()=>{location.href='apps/aa-campaign-map/';};
$('settings').onclick=()=>showDialog('preferences');
$('reset-camera').onclick=()=>{closeSite();world?.overview();};
$('zoom-in').onclick=()=>world?.zoom(1.2);$('zoom-out').onclick=()=>world?.zoom(1/1.2);
const stationIcon={templo:'temple',altar:'flame',olivo:'olive',puerto:'sail'};
sites.forEach((s,i)=>{
 const b=document.createElement('button');b.className='station';b.dataset.site=s.id;b.innerHTML=`<span class="station-symbol" aria-hidden="true">${uiIcon(stationIcon[s.id]||'compass')}</span><span class="station-name">${s.name}</span><span class="station-status" aria-hidden="true">${i+1}</span>`;b.setAttribute('aria-label',`Explorar ${s.name}`);b.onclick=()=>openSite(s.id);$('stations').append(b);
 const marker=document.createElement('button');marker.className='marker';marker.textContent=i+1;marker.setAttribute('aria-label','Explorar '+s.name);marker.dataset.marker=s.id;marker.onclick=()=>openSite(s.id);$('markers').append(marker);
});
function updateProgress(){
 $('progress').textContent=`${state.visited.length} de 4 lugares`;$('progress-bar').style.width=state.visited.length*25+'%';
 document.querySelectorAll('[data-site]').forEach(b=>{const done=state.visited.includes(b.dataset.site);b.setAttribute('aria-pressed',String(selectedSite===b.dataset.site));b.querySelector('.station-status').textContent=done?'✓':String(sites.findIndex(s=>s.id===b.dataset.site)+1);b.setAttribute('aria-label',`${b.querySelector('.station-name').textContent}. ${done?'Explorado':'Por explorar'}`);});
 document.querySelectorAll('[data-marker]').forEach(b=>b.classList.toggle('done',state.visited.includes(b.dataset.marker)));
 $('mission-complete').hidden=celebrationDismissed||state.visited.length!==4||selectedSite!==null||mode!=='explorar';
}
function siteVisuals(s){return [{image:s.image,alt:s.alt,title:s.visualTitle,note:s.visualNote},{image:s.image2,alt:s.alt2,title:s.visualTitle2,note:s.visualNote2}];}
function renderSiteVisual(announceChange=false){
 const s=sites.find(x=>x.id===selectedSite);if(!s)return;
 const visuals=siteVisuals(s),visual=visuals[siteVisualIndex];
 $('site-image').src=visual.image;$('site-image').alt=visual.alt;$('site-image-label').textContent=visual.title;$('site-image-note').textContent=visual.note;
 $('site-image-index').textContent=`${siteVisualIndex+1} de ${visuals.length}`;$('site-scene-cue').innerHTML=uiIcon('eye')+`<span>${sitePresentation[s.id].cue}</span>`;
 if(announceChange)announce(`${visual.title}. Imagen ${siteVisualIndex+1} de ${visuals.length}.`);
}
function changeSiteVisual(step){if(!selectedSite)return;const total=siteVisuals(sites.find(s=>s.id===selectedSite)).length;siteVisualIndex=(siteVisualIndex+step+total)%total;renderSiteVisual(true);}
$('site-image-prev').onclick=()=>changeSiteVisual(-1);$('site-image-next').onclick=()=>changeSiteVisual(1);
function openSite(id){const s=sites.find(s=>s.id===id);if(!s)return;selectedSite=id;siteVisualIndex=0;$('site-card').hidden=false;$('site-help').open=false;$('site-card').querySelector('.site-extra').open=false;$('site-label').textContent=s.label;$('site-title').textContent=s.name;$('site-text').textContent=s.text;renderSiteVisual();$('site-hint').textContent=s.hint;$('question').textContent=s.question;$('site-god').textContent='Conocer a '+gods.find(g=>g.id===s.god).name+' ↗';$('site-god').onclick=()=>openCodex(s.god);$('answers').replaceChildren();$('feedback').textContent=state.visited.includes(id)?'Hallazgo recuperado. '+s.feedback:'';
 s.options.forEach((text,i)=>{const b=document.createElement('button');b.textContent=text;b.onclick=()=>{state=answer(state,id,i,s.correct);persist();$('answers').querySelectorAll('button').forEach((el,n)=>{el.dataset.result=n===i?(i===s.correct?'correct':'wrong'):'';});$('feedback').textContent=i===s.correct?'¡Buena observación! '+s.feedback:'Aún no. '+(id==='templo'?'Recuerda: el modelo debe compararse con restos y medidas.':id==='altar'?'Piensa qué nos cuenta el objeto sobre las personas que lo usaron.':id==='olivo'?'El símbolo ayuda a entender el relato, pero no prueba que haya ocurrido.':'Podemos estudiar juntos los barcos, las rutas y las creencias.');announce(i===s.correct?'Hallazgo recuperado: '+s.name:'Puedes volver a intentarlo. Lee la pista.');updateProgress();};$('answers').append(b);});
 updateProgress();world?.focus(sitePresentation[id]);$('site-card').scrollTop=0;$('close-site').focus();}
function closeSite(){selectedSite=null;$('site-card').hidden=true;updateProgress();}
$('close-site').onclick=()=>{const id=selectedSite;closeSite();document.querySelector(`[data-site="${id}"]`)?.focus();};
const plain=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function renderGodList(){const q=plain($('god-search').value);const list=gods.filter(g=>(filter==='Todos'||g.group===filter)&&plain([g.name,g.domain,g.symbol,g.roman].join(' ')).includes(q));if(list.length&&!list.some(g=>g.id===selectedGod)){selectedGod=list[0].id;renderGod();}$('god-detail').hidden=!list.length;$('god-list').replaceChildren();$('god-count').textContent=`${list.length} ${list.length===1?"divinidad":"divinidades"} · ${state.learned.length} ${state.learned.length===1?"ficha leída":"fichas leídas"}`;
 list.forEach(g=>{const b=document.createElement('button');b.className='god-option';b.style.setProperty('--accent',g.color);b.setAttribute('aria-pressed',String(selectedGod===g.id));b.setAttribute('aria-label',g.name+' · '+g.domain);b.innerHTML=`<span class="glyph" aria-hidden="true">${icon(g.id)}</span><span><strong>${g.name}</strong><small>${g.domain}</small></span>${state.learned.includes(g.id)?'<span class="read" aria-label="Leída">✓</span>':''}`;b.onclick=()=>{selectedGod=g.id;renderGodList();renderGod();};$('god-list').append(b);});
 if(!list.length){const p=document.createElement('p');p.className='empty';p.textContent='No hay coincidencias. Prueba con otro nombre, un símbolo o el filtro Todos.';$('god-list').append(p);}
}
function renderGod(){
 const g=gods.find(g=>g.id===selectedGod);if(!g)return;
 const guide=learningGuides[g.id],el=$('god-detail');
 el.style.setProperty('--accent',g.color);
 el.innerHTML=`<div class="god-heading"><div class="god-emblem" aria-hidden="true">${icon(g.id)}</div><div><p class="greek" lang="el">${g.greek}</p><h3>${g.name}</h3><p>${g.domain}</p></div></div><button class="outline-button portrait-open" id="god-sculpture">${uiIcon('gallery')} Ver escultura 3D</button><section class="idea-card" aria-label="Idea clave"><span>${uiIcon('eye')} IDEA CLAVE</span><p>${guide.idea}</p></section><div class="learning-tools"><section><h4>${uiIcon('book')} PALABRA NUEVA</h4><p><strong>${guide.word}</strong>: ${guide.definition}</p></section><section><h4>${uiIcon('clue')} OBSERVA Y PIENSA</h4><p>${guide.look}</p></section></div><details class="god-more"><summary>${uiIcon('book')} Leer más sobre ${g.name}</summary><p class="god-copy">${g.text}</p><div class="detail-columns"><section><h4>EN LOS RELATOS</h4><p>${g.myth}</p></section><section><h4>LO QUE MUESTRAN LAS FUENTES</h4><p>${g.evidence}</p></section></div><div class="meta-line"><span>Símbolo: ${g.symbol}</span><span>·</span><span>Lugar relacionado: ${g.place}</span><span>·</span><span>Nombre romano: ${g.roman}</span></div><div class="relations" aria-label="Divinidades relacionadas"></div><a class="source-link" href="${g.source}" target="_blank" rel="noopener">Consultar relatos y fuentes antiguas en Theoi ↗</a></details><button class="outline-button read-button" id="mark-read">${state.learned.includes(g.id)?'✓ Ficha leída':'✓ Ya leí esta ficha'}</button>`;
 $('god-sculpture').onclick=()=>gallery.open(g.id);
 g.related.forEach(id=>{const target=gods.find(x=>x.id===id);const b=document.createElement('button');b.textContent=target.name+' →';b.onclick=()=>{selectedGod=id;filter='Todos';$('god-search').value='';syncFilters();renderGodList();renderGod();};el.querySelector('.relations').append(b);});
 $('mark-read').onclick=()=>{state.learned=[...new Set([...state.learned,g.id])];persist();renderGodList();$('mark-read').textContent='✓ Ficha leída';announce('Ficha de '+g.name+' guardada como leída.');};el.scrollTop=0;
}
function syncFilters(){document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));}
function openCodex(id){if(id){selectedGod=id;filter='Todos';$('god-search').value='';syncFilters();}renderGodList();renderGod();showDialog('codex');}
$('god-search').oninput=renderGodList;document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;syncFilters();renderGodList();});
$('reduced').checked=state.reduced;$('low-quality').checked=state.quality==='low';document.body.classList.toggle('reduced',state.reduced);
$('reduced').onchange=e=>{state.reduced=e.target.checked;document.body.classList.toggle('reduced',state.reduced);world?.setReduced(state.reduced);gallery.updatePreferences();sharedPrefs={...sharedPrefs,reduced:state.reduced};writePreferences(storage,preferenceProfile,sharedPrefs);persist();};
$('low-quality').onchange=e=>{state.quality=e.target.checked?'low':'high';world?.setQuality(state.quality);persist();};
$('text-size').value=state.textSize;document.documentElement.style.fontSize=16*state.textSize/100+'px';
$('text-size').onchange=e=>{state.textSize=Number(e.target.value);document.documentElement.style.fontSize=16*state.textSize/100+'px';sharedPrefs={...sharedPrefs,large:state.textSize>100};writePreferences(storage,preferenceProfile,sharedPrefs);persist();};
function syncLight(){document.querySelectorAll('[data-light]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.light===state.light)));}
syncLight();document.querySelectorAll('[data-light]').forEach(b=>b.onclick=()=>{state.light=b.dataset.light;world?.setLight(state.light);syncLight();persist();});
const gallery=setupGodGallery({getState:()=>state,setState:s=>state=s,persist,announce,showDialog,openCodex});
setupJournal({getState:()=>state,setState:s=>state=s,persist,showDialog,openCodex,exportNotebook});
let notebookUrl;
function exportNotebook(){const report={titulo:'Odisea del Egeo · Cuaderno del santuario',version:3,fecha:new Date().toISOString(),notas:state.notes,repasos:state.mastery,hallazgos:sites.map(s=>({lugar:s.name,recuperado:state.visited.includes(s.id),ultimaRespuesta:Number.isInteger(state.answers[s.id])?s.options[state.answers[s.id]]:null,explicacion:s.feedback})),fichasLeidas:gods.filter(g=>state.learned.includes(g.id)).map(g=>g.name),esculturasObservadas:gods.filter(g=>state.observed.includes(g.id)).map(g=>g.name),fuentes:sources};const content=JSON.stringify(report,null,2);if(notebookUrl)URL.revokeObjectURL(notebookUrl);notebookUrl=URL.createObjectURL(new Blob([content],{type:'application/json'}));$('copy-content').value=content;$('copy-download').href=notebookUrl;showDialog('notebook-copy');}
$('copy-select').onclick=()=>{$('copy-content').focus();$('copy-content').select();};
$('export').onclick=exportNotebook;
const ambience=new Audio('assets/reconstruction/egeo-aa/audio/sea-bed.ogg');ambience.loop=true;ambience.volume=.22;
$('sound').onclick=async()=>{if(ambience.paused){try{await ambience.play();$('sound').textContent='Sonido: encendido';$('sound').setAttribute('aria-pressed','true');}catch{$('sound').textContent='Audio no disponible';}}else{ambience.pause();$('sound').textContent='Sonido: apagado';$('sound').setAttribute('aria-pressed','false');}};
document.addEventListener('visibilitychange',()=>{if(document.hidden)ambience.pause();else if($('sound').getAttribute('aria-pressed')==='true')ambience.play().catch(()=>{});});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('dialog[open]')&&selectedSite){closeSite();}});
updateProgress();persist();
// Import renderer independently: all learning functions survive graphics failures.
const illustrated=new URLSearchParams(location.search).get('vista')==='ilustrada';
if(illustrated){document.body.dataset.render='fallback';$('scene-status').textContent='Vista ilustrada · aprendizaje completo disponible';$('illustrated-link').href='./';$('illustrated-link').textContent='Volver a la experiencia 3D ↗';}
else import('./world.js?v=premium3').then(async({Sanctuary})=>{world=new Sanctuary($('scene'),sites,()=>mode);world.setReduced(state.reduced);world.setQuality(state.quality);world.setLight(state.light);await world.load();document.body.dataset.render='ready';$('scene-status').textContent='SANTUARIO DE NAXOS · Reconstrucción didáctica';$('markers').hidden=mode!=='explorar';world.pause(Boolean(document.querySelector('dialog[open]')));}).catch(e=>{console.error('Escena 3D:',e);document.body.dataset.render='fallback';$('markers').hidden=true;$('scene-status').textContent='Vista ilustrada · exploración y códice disponibles';world?.dispose();world=null;});


// Resume the new journey without modifying legacy progress.
import {loadJourney,JOURNEY_KEY} from './adventure-state.js';
let journeyProfile='main';try{const savedProfile=storage?.getItem('odisea.active-player');journeyProfile=['main','dolphin','owl','olive'].includes(savedProfile)?savedProfile:'main';}catch{}
const journey=loadJourney(storage,journeyProfile==='main'?JOURNEY_KEY:JOURNEY_KEY+'.'+journeyProfile);
if(journey.updatedAt)$('journey-start').innerHTML='Continuar mi aventura <span>→</span>';
const entryQuery=new URLSearchParams(location.search);
setupAdventureReturn(document,location.search);
if(entryQuery.has('explorar'))explore();
if(entryQuery.has('cuaderno'))$('nav-journal').click();
if(entryQuery.has('escultura')){const id=entryQuery.get('escultura');gallery.open(gods.some(g=>g.id===id)?id:'zeus');}

// Receive accessibility changes from the adventure without changing sanctuary discoveries.
window.addEventListener('storage',e=>{
 if(e.key!==preferenceKey(preferenceProfile))return;
 sharedPrefs=readPreferences(storage,preferenceProfile,sharedPrefs);
 state.reduced=sharedPrefs.reduced;state.textSize=sharedPrefs.large?130:100;
 document.body.classList.toggle('reduced',state.reduced);
 document.body.classList.toggle('contrast',sharedPrefs.contrast);
 document.documentElement.style.fontSize=16*state.textSize/100+'px';
 $('reduced').checked=state.reduced;$('text-size').value=String(state.textSize);
 world?.setReduced(state.reduced);gallery.updatePreferences();
});
