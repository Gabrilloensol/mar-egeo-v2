import {createVoice} from '../../premium/adventure-voice.js';
import {uiIcon} from '../../premium/ui-icons.js?v=voyage23';
import {activeProfile, readPreferences} from '../../premium/shared-preferences.js';

const assets = '../../premium/assets/curriculum/';
const stops = [
  {
    label: 'El estadio', icon: 'temple',
    image: 'olympia-stadium.jpg', alt: 'Pista de tierra del estadio antiguo de Olimpia, entre lomas cubiertas de pasto.',
    caption: 'Restos del estadio de Olimpia, Grecia · Fotografía de 2020',
    credit: '<a href="https://commons.wikimedia.org/wiki/File:The_stadium_of_Ancient_Olympia_on_14_October_2020.jpg">George E. Koronaios</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> · versión reducida',
    intro: 'Hace más de 2.500 años, los griegos se reunían en Olimpia para competir y honrar a Zeus. Aún se puede visitar el lugar.',
    question: '¿Dónde se celebraban los Juegos Olímpicos antiguos?',
    options: ['En Atenas', 'En Olimpia', 'En Chile'], correct: 1,
    replies: ['Atenas fue sede de los primeros Juegos Olímpicos modernos en 1896. Los antiguos se celebraban en Olimpia.', 'En Olimpia, un lugar de Grecia. La foto muestra lo que se conserva del estadio.', 'Los juegos antiguos nacieron en Grecia. Busca el nombre del estadio en el pie de foto.'],
  },
  {
    label: 'Las carreras', icon: 'compass',
    image: 'olympia-runners.jpg', alt: 'Tres atletas se preparan para correr en una pista de tierra frente a espectadores.',
    caption: 'Una carrera en Olimpia · Recreación con vestimenta adaptada para el aula',
    intro: 'En Olimpia había carreras a pie. Mira la ilustración e imagina la señal de salida. Hoy también hay carreras en los Juegos Olímpicos.',
    question: '¿Qué prueba se hacía antes y se sigue haciendo hoy?',
    options: ['Carreras a pie', 'Carreras de autos', 'Carreras de bicicletas'], correct: 0,
    replies: ['En las dos épocas hay atletas que corren a pie.', 'Observa cómo se preparan los atletas de la ilustración. Van a correr a pie.', 'En los juegos modernos hay ciclismo. En Olimpia los atletas de esta escena se preparan para correr a pie.'],
  },
  {
    label: 'Los premios', icon: 'olive',
    image: 'olympic-awards.jpg', alt: 'Una corona de ramas de olivo a la izquierda y una medalla con cinta azul a la derecha.',
    caption: 'Corona de olivo y medalla · Ilustración didáctica',
    intro: 'En Olimpia, el ganador recibía una corona de olivo. En los Juegos Olímpicos de hoy se entregan medallas.',
    question: '¿Qué premio recibía el ganador en Olimpia?',
    options: ['Una medalla', 'Una copa', 'Una corona de olivo'], correct: 2,
    replies: ['La medalla corresponde a los juegos modernos. Compara los dos premios de la imagen.', 'Mira las hojas a la izquierda de la imagen. Forman el premio de Olimpia.', 'El ganador recibía una corona hecha con ramas de olivo. Hoy se entregan medallas.'],
    comparison: true,
  },
];

const byId = id => document.getElementById(id);
const rail = byId('olympia-stops');
const panel = byId('olympia-stop');
const finish = byId('olympia-finish');
const answers = new Map();
let current = 0;
let animation;
let preferences = {};
try { preferences = readPreferences(window.localStorage, activeProfile(window.localStorage)); } catch {}
document.body.classList.toggle('large', Boolean(preferences.large));
document.body.classList.toggle('contrast', Boolean(preferences.contrast));
const media = window.matchMedia('(prefers-reduced-motion: reduce)');
media.addEventListener('change', () => { if (media.matches) animation?.cancel(); });
const voice = createVoice({
  synthesis: window.speechSynthesis,
  Utterance: window.SpeechSynthesisUtterance,
  onChange: speaking => { const stop = byId('olympia-stop-audio'); if (stop) stop.hidden = !speaking; },
  onUnavailable: () => { byId('olympia-live').textContent = 'La lectura en voz alta no está disponible en este navegador.'; },
  onError: () => { byId('olympia-live').textContent = 'La lectura se interrumpió. Puedes volver a intentarlo.'; },
});

function renderRail() {
  rail.innerHTML = stops.map((stop, index) => `<button type="button" data-stop="${index}" aria-current="${index === current ? 'step' : 'false'}">${uiIcon(stop.icon)}<span>${stop.label}</span>${answers.get(index) === stop.correct ? '<span class="stop-check" aria-label="Respuesta encontrada">✓</span>' : ''}</button>`).join('');
}

function showAnswer(index, animate = false) {
  const stop = stops[current];
  const feedback = byId('olympia-feedback');
  const correct = index === stop.correct;
  feedback.dataset.result = correct ? 'correct' : 'retry';
  feedback.innerHTML = `${uiIcon(correct ? 'check' : 'eye')}<span></span>`;
  feedback.lastElementChild.textContent = `${correct ? '¡Lo encontraste! ' : ''}${stop.replies[index]}`;
  panel.querySelector('[data-read-feedback]').hidden = false;
  panel.querySelectorAll('[data-answer]').forEach(button => {
    const selected = Number(button.dataset.answer) === index;
    button.setAttribute('aria-pressed', String(selected));
    button.dataset.result = selected ? feedback.dataset.result : '';
    button.firstElementChild.innerHTML = selected ? uiIcon(correct ? 'check' : 'eye') : String(Number(button.dataset.answer) + 1);
    if (selected) button.parentElement.append(feedback);
  });
  if (animate && !preferences.reduced && !media.matches) {
    animation?.cancel();
    animation = feedback.animate?.([{clipPath:'inset(0 0 95% 0)', opacity:.65}, {clipPath:'inset(0)', opacity:1}], {duration:230, easing:'cubic-bezier(.18,.79,.29,1)'});
  }
  if (animate) byId('olympia-live').textContent = feedback.textContent;
}

function showStop(index, focus = true) {
  voice.stop();
  current = index;
  const stop = stops[index];
  finish.hidden = true;
  panel.hidden = false;
  renderRail();
  panel.innerHTML = `<figure class="olympia-plate">
    <img src="${assets + stop.image}" width="960" height="640" alt="${stop.alt}">
    <figcaption>${stop.caption}${stop.credit ? `<small>${stop.credit}</small>` : ''}</figcaption>
    ${stop.comparison ? '<dl class="olympia-pair"><div><dt>Antes</dt><dd>Corona de olivo</dd></div><div><dt>Hoy</dt><dd>Medallas</dd></div></dl>' : ''}
  </figure>
  <div class="olympia-sheet">
    <p class="overline">PARADA ${index + 1} DE ${stops.length}</p>
    <h2 id="stop-title" tabindex="-1">${stop.label}</h2>
    <p>${stop.intro}</p>
    <h3 id="olympia-question">${stop.question}</h3>
    <div class="olympia-audio"><button type="button" class="olympia-button" data-read>${uiIcon('audio')}Escuchar</button><button id="olympia-stop-audio" class="olympia-button" type="button" data-stop-audio hidden>Detener lectura</button></div>
    <div class="olympia-choices" role="group" aria-labelledby="olympia-question">${stop.options.map((option, choice) => `<div><button type="button" data-answer="${choice}" aria-pressed="false"><span class="olympia-answer-mark" aria-hidden="true">${choice+1}</span><span>${option}</span></button></div>`).join('')}</div>
    <p id="olympia-feedback"></p>
    <button type="button" class="olympia-button feedback-audio" data-read-feedback hidden>${uiIcon('audio')}Escuchar explicación</button>
    <button type="button" class="olympia-button primary" data-next>${index === stops.length - 1 ? 'Ver mi descubrimiento' : 'Siguiente parada'} →</button>
  </div>`;
  if (answers.has(index)) showAnswer(answers.get(index));
  if (focus) {
    byId('stop-title').focus({preventScroll:true});
    if (panel.getBoundingClientRect().top < 0) rail.scrollIntoView({block:'start'});
  }
  animation?.cancel();
  if (focus && !preferences.reduced && !media.matches) {
    animation = panel.animate?.([{opacity:.55, transform:'translateY(5px)'},{opacity:1, transform:'none'}], {duration:240, easing:'cubic-bezier(.2,.82,.28,1)'});
  }
}

rail.addEventListener('click', event => {
  const button = event.target.closest('[data-stop]');
  if (button) showStop(Number(button.dataset.stop));
});
panel.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  const stop = stops[current];
  if (button.hasAttribute('data-answer')) {
    const index = Number(button.dataset.answer);
    answers.set(current, index);
    showAnswer(index, true);
    renderRail();
  } else if (button.hasAttribute('data-read')) {
    voice.speak([stop.intro, stop.question, ...stop.options.map((option, index) => `Opción ${index + 1}: ${option}.`)].join(' '));
  } else if (button.hasAttribute('data-read-feedback')) {
    voice.speak(byId('olympia-feedback').textContent);
  } else if (button.hasAttribute('data-stop-audio')) {
    voice.stop();
    panel.querySelector('[data-read]').focus();
  } else if (button.hasAttribute('data-next')) {
    if (current < stops.length - 1) showStop(current + 1);
    else {
      voice.stop();
      panel.hidden = true;
      finish.hidden = false;
      byId('finish-title').focus();
    }
  }
});
window.addEventListener('pagehide', () => voice.stop());
showStop(0, false);
