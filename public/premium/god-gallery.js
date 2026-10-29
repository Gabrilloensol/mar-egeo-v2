import {sculptureThemes,themeForSculpture,sculpturesInTheme} from './sculpture-themes.js';
import {gods} from './content.js';
import {icon} from './icons.js';
import {sculptureCatalog,sculptureForm} from './sculpture-catalog.js';
const $=id=>document.getElementById(id);
const attributes={
 zeus:['Hombros amplios y manto oblicuo','Barba rizada y corona de laurel','Rayo sobre atril de bronce'],
 hera:['Peplo de pliegues finos y dos broches','Rostro alargado, diadema y collar','Cetro de autoridad'],
 poseidon:['Tórax ancho y manto sobre un hombro','Barba ancha con curvas onduladas','Tridente de tres puntas'],
 demeter:['Chal con doble ribete','Broche vegetal y corona de espigas','Haz de trigo'],
 atenea:['Égida con escamas y relieve de lechuza','Casco con cresta y carrilleras','Lanza de bronce'],
 apolo:['Manto oblicuo y silueta ligera','Rostro ovalado y laurel','Lira de siete cuerdas'],
 artemisa:['Quitón con tahalí diagonal','Carcaj y flechas tras el hombro','Arco tensado'],
 ares:['Coraza ancha con láminas inferiores','Casco con protector nasal','Lanza'],
 afrodita:['Manto bajo de pliegues amplios','Diadema, pendientes y cabello recogido','Rosa de bronce'],
 hefesto:['Martillo, tenazas y yunque','Gorro y delantal de artesano','Cuerpo completo y postura de trabajo'],
 hermes:['Manto de viajero prendido al hombro','Pétaso y alas en las sienes','Caduceo'],
 dioniso:['Manto asimétrico con hojas de hiedra','Corona de vid con uvas','Tirso rematado en piña'],
 hestia:['Hogar de tres patas y llama tallada','Velo y manto de pliegues profundos','Bastón con remate circular'],
 hades:['Bidente ceremonial','Llaves como símbolo de autoridad','Manto de cuerpo completo'],
 persefone:['Antorcha de doble llama','Granada y narcisos','Vestido arcaico de cuerpo completo']};

export function setupGodGallery({getState,setState,persist,announce,showDialog,openCodex}){
 let viewer=null,selected='zeus',ticket=0,auto=false;
 const missionSelections=new Map(Object.entries(getState().observationDetails||{}).map(([id,v])=>[id,new Set(v)]));
 const dialog=$('sculptures');
 $('sculpture-filter').querySelector('[value=full]').textContent=`Cuerpo completo · ${gods.filter(g=>sculptureForm(g.id)==='Cuerpo completo').length}`;
 const themeSelect=$('sculpture-theme');
 for(const theme of sculptureThemes){const option=document.createElement('option');option.value=theme.id;option.textContent=theme.label;themeSelect.append(option);}
 const available=()=>sculpturesInTheme(gods,themeSelect.value).filter(g=>$('sculpture-filter').value!=='full'||sculptureForm(g.id)==='Cuerpo completo');
 function syncCollection(){const list=available();document.querySelectorAll('[data-sculpture]').forEach(b=>b.hidden=!list.some(g=>g.id===b.dataset.sculpture));$('sculpture-index').textContent=String(list.findIndex(g=>g.id===selected)+1).padStart(2,'0')+' / '+list.length;return list;}
 function renderMission(id,details){
  const completed=getState().observed.includes(id);
  let found=missionSelections.get(id)||new Set();
  if(completed)found=new Set(details.map((_,i)=>i));
  missionSelections.set(id,found);
  const items=details.map((text,index)=>{
   const li=document.createElement('li'),button=document.createElement('button');
   button.type='button';button.className='sculpture-find';button.disabled=completed;button.setAttribute('aria-pressed',String(found.has(index)));button.setAttribute('aria-label',`${found.has(index)?'Encontrado':'Buscar'}: ${text}`);
   const mark=document.createElement('span');mark.className='sculpture-find-mark';mark.setAttribute('aria-hidden','true');mark.textContent=found.has(index)?'✓':'○';
   const copy=document.createElement('span');copy.textContent=text;button.append(mark,copy);
   button.onclick=()=>{const set=missionSelections.get(id)||new Set();set.has(index)?set.delete(index):set.add(index);missionSelections.set(id,set);setState({...getState(),observationDetails:{...getState().observationDetails,[id]:[...set]}});persist();if(set.size===details.length&&!getState().observed.includes(id)){const state=getState();setState({...state,observed:[...new Set([...state.observed,id])]});persist();announce(`Reto de observación completado: ${gods.find(g=>g.id===id).name}.`);}renderMission(id,details);const buttons=[...$('sculpture-attributes').querySelectorAll('button')];const target=buttons[index];if(target&&!target.disabled)target.focus({preventScroll:true});else $('sculpture-read').focus({preventScroll:true});};
   li.append(button);return li;
  });
  $('sculpture-attributes').replaceChildren(...items);
  $('sculpture-mission-count').textContent=`${found.size} / ${details.length}`;$('sculpture-mission-count').dataset.complete=String(found.size===details.length);
  $('sculpture-mission-result').textContent=found.size===details.length?'Marcaste los tres detalles como observados. Cuéntale a alguien qué símbolo reconociste.':found.size?`Encontraste ${found.size}. Sigue girando la escultura para localizar ${details.length-found.size} más.`:'Observa primero la figura completa. Acércate solo cuando necesites comprobar un detalle.';
 }
 function error(message){$('sculpture-status').textContent=message;$('sculpture-fallback').hidden=false;$('sculpture-stage').dataset.ready='false';$('sculpture-retry').hidden=new URLSearchParams(location.search).get('vista')==='ilustrada';}
 async function select(id){
  selected=id;const n=++ticket;const g=gods.find(g=>g.id===id);if(!g)return;if(viewer)$('sculpture-stage').scrollIntoView({block:'start',behavior:'instant'});
  $('sculpture-name').textContent=g.name;$('sculpture-greek').textContent=g.greek;$('sculpture-domain').textContent=g.domain;$('sculpture-description').textContent=g.id==='zeus'?'En los relatos griegos, Zeus se relaciona con el cielo y la autoridad. Busca el águila y observa su postura.':g.name+' se relaciona con '+g.domain.toLowerCase()+'. Gira la figura y busca sus atributos.';
  const collection=available();$('sculpture-index').textContent=`${String(collection.indexOf(g)+1).padStart(2,'0')} / ${collection.length}`;
  $('sculpture-read').textContent=`Leer la historia de ${g.name} →`;
  const entry=sculptureCatalog[id];
  $('sculpture-kind').textContent=entry?`${sculptureForm(id).toUpperCase()} · ${entry.label||'ESCANEO SMK'}`:'ESTUDIO ESTILIZADO';
  $('sculpture-work').textContent=entry?.title||`Estudio de ${g.name}`;
  $('sculpture-note').textContent=entry?`${entry.note} Material e iluminación reinterpretados digitalmente.`:'Modelado estilizado original en Blender. Esta figura todavía no forma parte de la selección de escaneos de alta fidelidad.';
  $('sculpture-source').hidden=!entry;
  if(entry){$('sculpture-source').href=entry.source||`https://open.smk.dk/artwork/image/${entry.accession}`;$('sculpture-source').textContent=`Procedencia · ${entry.credit||'SMK '+entry.accession} ↗`;}
  renderMission(id,entry?.details||attributes[id]);
  $('sculpture-fallback').replaceChildren();const poster=document.createElement('img');poster.src=`premium/assets/gods/${id}.webp?v=refined7`;poster.alt='';poster.onerror=()=>{if(n===ticket)$('sculpture-fallback').innerHTML=icon(id);};$('sculpture-fallback').append(poster);$('sculpture-canvas').setAttribute('aria-label',`${entry?.title||'Escultura de '+g.name}. Usa los botones para girar la pieza o acercarte.`);
  document.querySelectorAll('[data-sculpture]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sculpture===id)));
  $('sculpture-stage').dataset.ready='false';$('sculpture-fallback').hidden=false;$('sculpture-retry').hidden=true;$('sculpture-status').textContent=`Preparando la escultura de ${g.name}…`;
  if(new URLSearchParams(location.search).get('vista')==='ilustrada'){error('Vista ilustrada: imagen de la escultura. Abre la experiencia 3D para girarla.');return;}
  try{
   if(!viewer){const {GodViewer}=await import('./god-viewer.js?v=refined7');if(n!==ticket||!dialog.open)return;viewer=new GodViewer($('sculpture-canvas'),{low:getState().quality==='low',reduced:getState().reduced,onError:error});}
   if(await viewer.load(id)&&n===ticket&&dialog.open){$('sculpture-fallback').hidden=true;$('sculpture-stage').dataset.ready='true';$('sculpture-status').textContent='Arrastra para girar · usa la rueda para acercarte';viewer.light($('sculpture-light').value);}
  }catch(e){if(n===ticket&&dialog.open&&e.name!=='AbortError')error('La escultura no está disponible en este momento. Puedes reintentar o seguir leyendo su historia.');}
 }
 function open(id='zeus'){auto=false;themeSelect.value=themeForSculpture(id);$('sculpture-filter').value=sculptureForm(id)==='Cuerpo completo'?'full':'all';document.querySelectorAll('[data-sculpture]').forEach(b=>b.hidden=!available().some(g=>g.id===b.dataset.sculpture));$('sculpture-auto').setAttribute('aria-pressed','false');$('sculpture-auto').disabled=getState().reduced;$('sculpture-auto').title=getState().reduced?'El giro automático está desactivado al reducir movimiento.':'';showDialog('sculptures');select(id);}
 gods.forEach(g=>{const b=document.createElement('button');b.dataset.sculpture=g.id;b.setAttribute('aria-label',g.name);b.innerHTML=`<span class="sculpture-thumb" aria-hidden="true"><img src="premium/assets/gods/${g.id}.webp?v=refined7" alt="" loading="lazy"></span><span>${g.name}</span><small>${sculptureForm(g.id)}</small>`;b.setAttribute('aria-pressed','false');b.onclick=()=>select(g.id);$('sculpture-list').append(b);});
 $('intro-gallery').onclick=()=>open();$('codex-gallery').onclick=()=>open();
 $('sculpture-read').onclick=()=>{const id=selected;dialog.close();openCodex(id);};
 $('sculpture-prev').onclick=()=>{const list=available();select(list[(list.findIndex(g=>g.id===selected)+list.length-1)%list.length].id);};
 $('sculpture-next').onclick=()=>{const list=available();select(list[(list.findIndex(g=>g.id===selected)+1)%list.length].id);};
 $('sculpture-filter').onchange=()=>{const list=syncCollection();if(!list.some(g=>g.id===selected))select(list[0].id);};
 themeSelect.onchange=()=>{const list=syncCollection();if(!list.some(g=>g.id===selected))select(list[0].id);announce(themeSelect.selectedOptions[0].textContent+': '+list.length+' figuras para explorar.');};
 $('sculpture-left').onclick=()=>viewer?.rotate(-1);$('sculpture-right').onclick=()=>viewer?.rotate(1);
 $('sculpture-near').onclick=()=>viewer?.zoom(.82);$('sculpture-far').onclick=()=>viewer?.zoom(1.22);
 $('sculpture-reset').onclick=()=>viewer?.reset();$('sculpture-light').onchange=e=>viewer?.light(e.target.value);
 $('sculpture-detail').onclick=()=>{viewer?.detail();$('sculpture-stage').scrollIntoView({block:'start',behavior:'instant'});};
 $('sculpture-auto').onclick=()=>{auto=!auto;viewer?.setAuto(auto);$('sculpture-auto').setAttribute('aria-pressed',String(auto));};
 $('sculpture-retry').onclick=()=>{viewer?.dispose();viewer=null;select(selected);};
 dialog.addEventListener('close',()=>{++ticket;viewer?.dispose();viewer=null;});
 function updatePreferences(){
  const reduced=getState().reduced;
  $('sculpture-auto').disabled=reduced;
  $('sculpture-auto').title=reduced?'El giro automático está desactivado al reducir movimiento.':'';
  viewer?.setReduced(reduced);
  if(reduced){auto=false;$('sculpture-auto').setAttribute('aria-pressed','false');}
 }
 return {open,updatePreferences};
}
