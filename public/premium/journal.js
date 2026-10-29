import {gods,sites} from './content.js';
import {icon} from './icons.js';
import {uiIcon} from './ui-icons.js';
import {createDeck,recordReview} from './study.js';
const $=id=>document.getElementById(id);
export function setupJournal({getState,setState,persist,showDialog,openCodex,exportNotebook}){
 let deck=[],step=0,results=[],locked=false;
 function openJournal(){renderJournal();showDialog('journal');}
 $('nav-journal').onclick=openJournal;$('complete-journal').onclick=openJournal;
 function renderJournal(){
  const state=getState();const known=Object.values(state.mastery).filter(v=>v.correct>0).length;
  $('journal-summary').innerHTML=`<span aria-label="${state.visited.length} de 4 lugares explorados">${uiIcon('compass')}<strong>${state.visited.length}/4</strong><small>lugares</small></span><span aria-label="${state.learned.length} de 15 dioses leídos">${uiIcon('book')}<strong>${state.learned.length}/15</strong><small>fichas</small></span><span aria-label="${state.observed.length} de 15 esculturas observadas">${uiIcon('eye')}<strong>${state.observed.length}/15</strong><small>esculturas</small></span><span aria-label="${known} de 15 dioses reconocidos">${uiIcon('check')}<strong>${known}/15</strong><small>reconocidos</small></span>`;
  $('journal-records').replaceChildren();
  sites.forEach((s,i)=>{
   const recovered=state.visited.includes(s.id),g=gods.find(g=>g.id===s.god);const card=document.createElement('details');card.className='record-card';
   card.innerHTML=`<summary><span class="record-symbol" aria-hidden="true">${icon(g.id)}</span><span><small>HUELLA ${i+1} · ${recovered?'EXPLORADA':'POR EXPLORAR'}</small><strong>${s.name}</strong></span><span class="record-open">Ver y escribir</span></summary><div class="record-body"><p class="record-evidence"></p><label>Mi interpretación<textarea maxlength="1200" rows="3" placeholder="¿Qué observaste? ¿Qué otra evidencia buscarías?"></textarea></label><span class="note-status" role="status"></span></div>`;
   card.querySelector('.record-evidence').textContent=recovered?s.feedback:'Explora este lugar y resuelve su pregunta para incorporar la interpretación a tu cuaderno.';
   const input=card.querySelector('textarea');input.value=state.notes[s.id]||'';input.setAttribute('aria-label','Mi interpretación: '+s.name);
   input.oninput=()=>{const st=getState();setState({...st,notes:{...st.notes,[s.id]:input.value.slice(0,1200)}});const saved=persist();card.querySelector('.note-status').textContent=saved?'Nota guardada.':'Nota en memoria; exporta tu cuaderno para conservarla.';};
   $('journal-records').append(card);
  });
  $('knowledge-list').replaceChildren();gods.forEach(g=>{const m=state.mastery[g.id];const b=document.createElement('button');b.className='knowledge-chip';b.innerHTML=`<span aria-hidden="true">${icon(g.id)}</span><strong>${g.name}</strong><small>${m?.attempts?`${m.correct}/${m.attempts} aciertos`:'Aún sin jugar'}</small>`;b.onclick=()=>{$('journal').close();openCodex(g.id);};$('knowledge-list').append(b);});
 }
 $('start-review').onclick=()=>{deck=createDeck(getState().mastery);step=0;results=[];$('journal').close();showDialog('review');renderQuestion();};
 function renderQuestion(){
  locked=false;const q=deck[step];$('review-progress').textContent=`REPASO ${step+1} DE ${deck.length}`;$('review-bar').style.width=(step/deck.length*100)+'%';
  $('review-stage').hidden=false;$('review-summary').hidden=true;$('review-next').hidden=true;$('review-explanation').textContent='';$('review-options').replaceChildren();
  $('review-clue-label').textContent=q.kind==='symbol'?'INTERPRETA EL SÍMBOLO':'RECONOCE SU ÁMBITO';$('review-clue').textContent=q.clue;
  $('review-symbol').innerHTML=q.kind==='symbol'?icon(q.id):'<span aria-hidden="true">Ω</span>';
  for(const option of q.options){const b=document.createElement('button');b.className='review-option';b.textContent=option.name;b.onclick=()=>{
    if(locked)return;locked=true;const correct=option.id===q.id;results.push({id:q.id,correct});const st=getState();setState({...st,mastery:recordReview(st.mastery,q.id,correct)});persist();
    for(const child of $('review-options').children){child.disabled=true;if(child.textContent===gods.find(g=>g.id===q.id).name)child.dataset.result='correct';}
    if(!correct)b.dataset.result='wrong';
    $('review-explanation').textContent=(correct?'Bien reconocido. ':'Se relaciona con '+gods.find(g=>g.id===q.id).name+'. ')+q.explanation;
    $('review-next').hidden=false;$('review-next').textContent=step===deck.length-1?'Ver mi recorrido →':'Siguiente símbolo →';$('review-next').focus();
   };$('review-options').append(b);}
  $('review-clue').focus();
 }
 $('review-next').onclick=()=>{if(!locked)return;step++;if(step<deck.length){renderQuestion();return;}$('review-stage').hidden=true;$('review-summary').hidden=false;$('review-bar').style.width='100%';$('review-progress').textContent='RECORRIDO COMPLETADO';$('review-score').textContent=results.filter(r=>r.correct).length+' de 5';$('review-revisit').replaceChildren();for(const r of results){const g=gods.find(g=>g.id===r.id),b=document.createElement('button');b.className='outline-button';b.textContent=(r.correct?'✓ ':'Repasar: ')+g.name;b.onclick=()=>{$('review').close();openCodex(r.id);};$('review-revisit').append(b);}$('review-score').focus();};
 $('review-journal').onclick=()=>{$('review').close();openJournal();};
 $('journal-export').onclick=exportNotebook;
}
