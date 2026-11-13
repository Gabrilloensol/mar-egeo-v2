import {createMenuMotion} from './menu-motion.js?v=atlas18';
import {activeProfile,readPreferences,writePreferences,preferenceKey} from './shared-preferences.js';
import {setupAdventureReturn} from './adventure-return.js';
import {gods,sites,sources,learningGuides,sitePresentation} from './content.js?v=explore14';
import {load,save,answer} from './state.js?v=explore14';
import {icon} from './icons.js';
import {uiIcon,decorateUiIcons} from './ui-icons.js?v=voyage23';
import {setupJournal} from './journal.js?v=voyage23';
import {setupGodGallery} from './god-gallery.js';
const $=id=>document.getElementById(id);
decorateUiIcons();
let storage;try{storage=localStorage;}catch{storage=null;}
let state=load(storage),world=null,selectedSite=null,siteVisualIndex=0,selectedGod='poseidon',filter='Todos',mode='inicio';
const preferenceProfile=activeProfile(storage);let sharedPrefs;
let exploreView = 'field';
const illustrated = new URLSearchParams(location.search).get('vista') === 'ilustrada';
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const menuMotion = createMenuMotion(document, () => state.reduced || motionPreference.matches);
let worldRequest;
let viewRequest = 0;
motionPreference.addEventListener?.('change', () => {
  if (motionPreference.matches) menuMotion.stop();
  world?.setReduced(state.reduced || motionPreference.matches);
});
let celebrationDismissed=state.visited.length===4;
state.learned=state.learned.filter(id=>gods.some(g=>g.id===id));
try{if(!storage?.getItem('odisea.sanctuary.v1'))state.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;}catch{state.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;}
sharedPrefs=readPreferences(storage,preferenceProfile,{reduced:state.reduced,large:state.textSize>100});state.reduced=sharedPrefs.reduced;if(sharedPrefs.large&&state.textSize===100)state.textSize=130;else if(!sharedPrefs.large)state.textSize=100;document.body.classList.toggle('contrast',sharedPrefs.contrast);
function persist(){const ok=save(storage,state);$('save-status').textContent=ok?'Los hallazgos están guardados en este navegador.':'No se pudo guardar. Puedes exportar el cuaderno para conservar tus hallazgos.';return ok;}
function announce(t){$('live').textContent=t;}
function showDialog(id) {
  document.querySelectorAll('dialog[open]').forEach(other => { if (other.id !== id) other.close(); });
  const dialog = $(id);
  if (!dialog.open) {
    dialog.showModal();
    menuMotion.sequence([{element:dialog.querySelector('.dialog-top > div'),delay:55,duration:215,distance:5}]);
  }
  world?.pause(true);
}
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',()=>{syncWorld();}));
function syncWorld() {
  const show3d = mode === 'explorar' && exploreView === '3d';
  world?.pause(!show3d || Boolean(document.querySelector('dialog[open]')));
  $('markers').hidden = mode !== 'explorar' || exploreView !== '3d' || document.body.dataset.render !== 'ready';
  $('explore-view').hidden = illustrated || document.body.dataset.render === 'fallback';
  $('explore-view').textContent = exploreView === '3d' ? 'Volver a las ilustraciones' : 'Vista 3D';
  $('explore-view').setAttribute('aria-pressed', String(exploreView === '3d'));
  updateProgress();
}
function explore() {
  viewRequest++;
  $('nav-explore').setAttribute('aria-current','page');
  mode = 'explorar';
  exploreView = 'field';
  document.body.dataset.mode = mode;
  document.body.dataset.exploreView = exploreView;
  $('intro').hidden = true;
  $('exploration').hidden = false;
  openSite(selectedSite || sites[0].id, false);
  syncWorld();
  $('stations').querySelector('button')?.focus({preventScroll:true});
  window.scrollTo(0,0);
}
function home() {
  viewRequest++;
  $('nav-explore').removeAttribute('aria-current');
  mode = 'inicio';
  document.body.dataset.mode = mode;
  $('intro').hidden = false;
  $('exploration').hidden = true;
  closeSite();
  syncWorld();
  announce('');
  world?.home();
  window.scrollTo(0,0);
  $('journey-start').focus({preventScroll:true});
}
$('explore-view').onclick = async () => {
  const button = $('explore-view');
  const request = ++viewRequest;
  if (exploreView === 'field' && !world) {
    button.disabled = true;
    button.setAttribute('aria-busy','true');
    button.textContent = 'Cargando vista 3D…';
    const ready = await prepareWorld();
    button.disabled = false;
    button.removeAttribute('aria-busy');
    if (!ready || request !== viewRequest || mode !== 'explorar') {
      syncWorld();
      return;
    }
  }
  exploreView = exploreView === 'field' ? '3d' : 'field';
  document.body.dataset.exploreView = exploreView;
  if (exploreView === '3d') {
    if (selectedSite) world?.focus(sitePresentation[selectedSite]);
    else world?.overview();
  }
  syncWorld();
  window.scrollTo(0,0);
};
for (const id of ['start','nav-explore']) $(id).onclick = () => {
  if (mode === 'inicio') menuMotion.transition('section', explore, '#exploration');
  else explore();
};
$('home').onclick = () => {
  if (mode === 'explorar' && exploreView === 'field') menuMotion.transition('section', home, '#intro');
  else home();
};
$('dismiss-complete').onclick=()=>{celebrationDismissed=true;updateProgress();$('stations').querySelector('button')?.focus();};
for(const id of ['nav-codex','intro-codex','complete-codex'])$(id).onclick=()=>openCodex();
$('nav-campaign').onclick=()=>{location.href='apps/aa-campaign-map/';};
$('settings').onclick=()=>showDialog('preferences');
$('reset-camera').onclick=()=>{closeSite();world?.overview();};
$('zoom-in').onclick=()=>world?.zoom(1.2);$('zoom-out').onclick=()=>world?.zoom(1/1.2);
const stationIcon={templo:'temple',altar:'flame',olivo:'olive',puerto:'sail'};
sites.forEach((s,i)=>{
 const b=document.createElement('button');b.className='station';b.dataset.site=s.id;b.innerHTML=`<span class="station-symbol" aria-hidden="true">${uiIcon(stationIcon[s.id]||'compass')}</span><span class="station-name">${s.name}</span><span class="station-status" aria-hidden="true">${i+1}</span><span class="station-indicator" aria-hidden="true"></span>`;b.setAttribute('aria-label',`Explorar ${s.name}`);b.onclick=()=>{
  if (exploreView === 'field' && selectedSite !== s.id) menuMotion.transition('station', () => openSite(s.id), '#site-card');
  else openSite(s.id);
 };$('stations').append(b);
 const marker=document.createElement('button');marker.className='marker';marker.textContent=i+1;marker.setAttribute('aria-label','Explorar '+s.name);marker.dataset.marker=s.id;marker.onclick=()=>openSite(s.id);$('markers').append(marker);
});
function updateProgress(){
 $('progress').textContent=`${state.visited.length} de 4 lugares explorados`;$('progress-bar').style.width=state.visited.length*25+'%';
 document.querySelectorAll('[data-site]').forEach(b=>{const done=state.visited.includes(b.dataset.site);b.setAttribute('aria-pressed',String(selectedSite===b.dataset.site));b.querySelector('.station-status').textContent=done?'✓':exploreView==='3d'?String(sites.findIndex(s=>s.id===b.dataset.site)+1):'';b.setAttribute('aria-label',`${b.querySelector('.station-name').textContent}. ${done?'Explorado':'Por explorar'}`);});
 document.querySelectorAll('[data-marker]').forEach(b=>b.classList.toggle('done',state.visited.includes(b.dataset.marker)));
 $('mission-complete').hidden=celebrationDismissed||state.visited.length!==4||selectedSite!==null||mode!=='explorar';
}
function siteVisuals(s){return [{image:s.image,alt:s.alt,title:s.visualTitle,note:s.visualNote},{image:s.image2,alt:s.alt2,title:s.visualTitle2,note:s.visualNote2}];}
function renderSiteVisual(announceChange=false){
 const s=sites.find(x=>x.id===selectedSite);if(!s)return;
 const visuals=siteVisuals(s),visual=visuals[siteVisualIndex];
 $('site-image').src=visual.image;$('site-image').alt=visual.alt;$('site-image-label').textContent=visual.title;$('site-image-note').textContent=visual.note;
 $('site-image-index').textContent=`${siteVisualIndex+1} de ${visuals.length}`;$('site-scene-cue').innerHTML=uiIcon('eye')+`<span>${s.observe}</span>`;
 if(announceChange)announce(`${visual.title}. Imagen ${siteVisualIndex+1} de ${visuals.length}.`);
}
function changeSiteVisual(step){if(!selectedSite)return;const total=siteVisuals(sites.find(s=>s.id===selectedSite)).length;const show = () => { siteVisualIndex=(siteVisualIndex+step+total)%total; renderSiteVisual(true); };
 if (exploreView === 'field') menuMotion.transition('plate', show, '.site-image-frame'); else show();}
$('site-image-prev').onclick=()=>changeSiteVisual(-1);$('site-image-next').onclick=()=>changeSiteVisual(1);
function openSite(id, focus = true) {
  const site = sites.find(item => item.id === id);
  if (!site) return;
  selectedSite = id;
  siteVisualIndex = 0;
  const card = $('site-card');
  card.hidden = false;
  card.dataset.station = id;
  $('site-source').hidden = id !== 'templo';
  card.querySelectorAll('details').forEach(details => { details.open = false; });
  $('site-label').textContent = site.theme;
  $('site-title').textContent = site.name;
  $('site-text').textContent = site.text;
  $('site-hint').textContent = site.hint;
  $('question').textContent = site.question;
  $('site-god').textContent = 'Conocer a ' + gods.find(god => god.id === site.god).name + ' ↗';
  $('site-god').onclick = () => openCodex(site.god);
  renderSiteVisual();

  const feedback = $('feedback');
  const savedChoice = state.answerRevisions?.[id] === 2 ? state.answers[id] : undefined;
  const setFeedback = (text, result) => {
    feedback.dataset.result = result;
    feedback.innerHTML = text && result ? `${uiIcon(result === 'correct' ? 'check' : 'eye')}<span></span>` : '';
    if (feedback.lastElementChild) feedback.lastElementChild.textContent = text;
    else feedback.textContent = text;
  };
  setFeedback(site.responses[savedChoice] || (state.visited.includes(id) ? 'Ya guardaste un hallazgo en este lugar.' : ''), savedChoice === undefined ? '' : savedChoice === site.correct ? 'correct' : 'wrong');
  const answers = $('answers');
  answers.replaceChildren();
  site.options.forEach((text, index) => {
    const button = document.createElement('button');
    button.innerHTML = `<span class="answer-index" aria-hidden="true">${index + 1}</span><span></span>`;
    button.lastElementChild.textContent = text;
    button.setAttribute('aria-pressed', String(index === savedChoice));
    if (index === savedChoice) {
      button.dataset.result = feedback.dataset.result;
      button.firstElementChild.innerHTML = uiIcon(index === site.correct ? 'check' : 'eye');
    }
    button.onclick = () => {
      const correct = index === site.correct;
      state = answer(state, id, index, site.correct);
      persist();
      [...answers.children].forEach((option, i) => {
        option.dataset.result = i === index ? correct ? 'correct' : 'wrong' : '';
        option.setAttribute('aria-pressed', String(i === index));
        option.firstElementChild.innerHTML = i === index ? uiIcon(correct ? 'check' : 'eye') : String(i + 1);
      });
      setFeedback(site.responses[index], correct ? 'correct' : 'wrong');
      menuMotion.response(feedback, correct);
      updateProgress();
    };
    answers.append(button);
  });
  updateProgress();
  if (exploreView === '3d') world?.focus(sitePresentation[id]);
  card.scrollTop = 0;
  if (focus) card.focus({preventScroll:matchMedia('(min-width: 761px)').matches});
}
function closeSite() {
  selectedSite = null;
  $('site-card').hidden = true;
  updateProgress();
}
$('close-site').onclick = () => {
  const id = selectedSite;
  closeSite();
  [...$('stations').children].find(button => button.dataset.site === id)?.focus();
};
const plain=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function renderGodList(){const q=plain($('god-search').value);const list=gods.filter(g=>(filter==='Todos'||g.group===filter)&&plain([g.name,g.domain,g.symbol,g.roman].join(' ')).includes(q));if(list.length&&!list.some(g=>g.id===selectedGod)){selectedGod=list[0].id;renderGod();}$('god-detail').hidden=!list.length;$('god-list').replaceChildren();$('god-count').textContent=`${list.length} ${list.length===1?"divinidad":"divinidades"} · ${state.learned.length} ${state.learned.length===1?"ficha leída":"fichas leídas"}`;
 list.forEach(g=>{const b=document.createElement('button');b.className='god-option';b.style.setProperty('--accent',g.color);b.setAttribute('aria-pressed',String(selectedGod===g.id));b.setAttribute('aria-label',g.name+' · '+g.domain);b.innerHTML=`<span class="glyph" aria-hidden="true">${icon(g.id)}</span><span><strong>${g.name}</strong><small>${g.domain}</small></span>${state.learned.includes(g.id)?'<span class="read" aria-label="Leída">✓</span>':''}`;b.onclick=()=>{
  if (selectedGod === g.id) return;
  selectedGod=g.id;
  renderGodList();
  renderGod();
  $('god-list').querySelector('[aria-pressed="true"]')?.focus({preventScroll:true});
  menuMotion.sequence([{element:$('god-detail').querySelector('.god-heading'),duration:220,distance:6}]);
 };$('god-list').append(b);});
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
$('reduced').onchange=e=>{state.reduced=e.target.checked;document.body.classList.toggle('reduced',state.reduced);world?.setReduced(state.reduced||motionPreference.matches);if(state.reduced)menuMotion.stop();gallery.updatePreferences();sharedPrefs={...sharedPrefs,reduced:state.reduced};writePreferences(storage,preferenceProfile,sharedPrefs);persist();};
$('low-quality').onchange=e=>{state.quality=e.target.checked?'low':'high';world?.setQuality(state.quality);persist();};
$('text-size').value=state.textSize;document.documentElement.style.fontSize=16*state.textSize/100+'px';
$('text-size').onchange=e=>{state.textSize=Number(e.target.value);document.documentElement.style.fontSize=16*state.textSize/100+'px';sharedPrefs={...sharedPrefs,large:state.textSize>100};writePreferences(storage,preferenceProfile,sharedPrefs);persist();};
function syncLight(){document.querySelectorAll('[data-light]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.light===state.light)));}
syncLight();document.querySelectorAll('[data-light]').forEach(b=>b.onclick=()=>{state.light=b.dataset.light;world?.setLight(state.light);syncLight();persist();});
const gallery=setupGodGallery({getState:()=>state,setState:s=>state=s,persist,announce,showDialog,openCodex});
setupJournal({getState:()=>state,setState:s=>state=s,persist,showDialog,openCodex,exportNotebook});
let notebookUrl;
function exportNotebook(){const report={titulo:'Odisea del Egeo · Cuaderno del santuario',version:3,fecha:new Date().toISOString(),notas:state.notes,repasos:state.mastery,hallazgos:sites.map(s=>({lugar:s.name,recuperado:state.visited.includes(s.id),ultimaRespuesta:Number.isInteger(state.answers[s.id])?(state.answerRevisions?.[s.id]===2?s.options:s.legacyOptions)[state.answers[s.id]]:null,explicacion:state.answerRevisions?.[s.id]===2?s.responses[state.answers[s.id]]:s.legacyFeedback})),fichasLeidas:gods.filter(g=>state.learned.includes(g.id)).map(g=>g.name),esculturasObservadas:gods.filter(g=>state.observed.includes(g.id)).map(g=>g.name),fuentes:sources};const content=JSON.stringify(report,null,2);if(notebookUrl)URL.revokeObjectURL(notebookUrl);notebookUrl=URL.createObjectURL(new Blob([content],{type:'application/json'}));$('copy-content').value=content;$('copy-download').href=notebookUrl;showDialog('notebook-copy');}
$('copy-select').onclick=()=>{$('copy-content').focus();$('copy-content').select();};
$('export').onclick=exportNotebook;
const ambience=new Audio('assets/reconstruction/egeo-aa/audio/sea-bed.ogg');ambience.loop=true;ambience.volume=.22;
$('sound').onclick=async()=>{if(ambience.paused){try{await ambience.play();$('sound').textContent='Sonido: encendido';$('sound').setAttribute('aria-pressed','true');}catch{$('sound').textContent='Audio no disponible';}}else{ambience.pause();$('sound').textContent='Sonido: apagado';$('sound').setAttribute('aria-pressed','false');}};
document.addEventListener('visibilitychange',()=>{if(document.hidden)ambience.pause();else if($('sound').getAttribute('aria-pressed')==='true')ambience.play().catch(()=>{});});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('dialog[open]')&&selectedSite){$('close-site').click();}});
updateProgress();persist();
// The illustrated menu is ready before downloading the 3D sanctuary.
function prepareWorld() {
  if (worldRequest) return worldRequest;
  $('fallback').src = $('fallback').dataset.src;
  worldRequest = import('./world.js?v=premium3').then(async ({Sanctuary}) => {
    const renderer = new Sanctuary($('scene'), sites, () => mode);
    world = renderer;
    renderer.pause(true);
    renderer.setReduced(state.reduced || motionPreference.matches);
    renderer.setQuality(state.quality);
    renderer.setLight(state.light);
    await renderer.load();
    document.body.dataset.render = 'ready';
    $('scene-status').textContent = 'Santuario de Naxos · Reconstrucción didáctica';
    syncWorld();
    return true;
  }).catch(error => {
    console.error('Escena 3D:', error);
    document.body.dataset.render = 'fallback';
    $('scene-status').textContent = 'Vista 3D no disponible en este navegador';
    announce('La vista 3D no está disponible. Puedes seguir explorando las ilustraciones.');
    world?.dispose();
    world = null;
    syncWorld();
    $('nav-explore').focus({preventScroll:true});
    return false;
  });
  return worldRequest;
}
if (illustrated) {
  document.body.dataset.render = 'fallback';
  $('illustrated-link').href = '?explorar';
  $('illustrated-link').textContent = 'Habilitar acceso a la vista 3D ↗';
}
syncWorld();

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
if (mode === 'inicio' && !document.querySelector('dialog[open]')) {
  menuMotion.sequence([
    {element:$('menu-title'),duration:300,distance:12},
    {element:document.querySelector('#intro .intro-copy'),delay:60,duration:255},
    {element:document.querySelector('.menu-primary-actions'),delay:105,duration:250},
    {element:document.querySelector('.menu-shortcuts'),delay:145,duration:230,distance:5},
  ]);
}

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
