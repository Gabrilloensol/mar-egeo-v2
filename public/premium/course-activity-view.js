import {tradeScene} from './trade-scene.js?v=trade21';
import {tradeWords} from './curriculum-trade.js?v=activities13';

const evidence = {
  europe: ['Un mapa del mundo', 'Los puntos marcan Chile y Grecia. Las etiquetas nombran sus continentes.'],
  aegean: ['Las islas del Egeo', 'Mira la forma de las costas y el agua entre las islas.'],
  time: ['Dos momentos', 'Compara la fecha de construcción con la fecha de la foto.'],
  terrain: ['Una costa y su ruta', 'Observa el barco, la costa y las montañas.'],
  work: ['Barro en el taller', 'Fíjate en el material que se está moldeando.'],
  agora: ['Una plaza con puestos', 'Observa dónde se reúnen las personas.'],
  today: ['Dos maneras de tejer', 'Compara el telar de madera y la máquina.'],
  theatre: ['Una obra en el teatro', 'Distingue a los actores del público sentado.'],
  games: ['Dos premios', 'Compara lo que recibe un ganador en cada época.'],
  rights: ['Participar en Atenas', 'Compara quién podía tomar decisiones y quién quedaba fuera.'],
  object: ['Foto y ficha del museo', 'Observa la pieza y compara lo que ves con lo que dice el museo.'],
  limit: ['Lo que podemos ver', 'Las asas y las figuras están en la imagen. ¿Qué quedaría por averiguar?'],
  transfer: ['Una ficha por completar', 'Imagina otra pieza y elige cómo investigar su historia.'],
};

const scenes = {
  terrain: ['premium/assets/places/puerto-navegacion.webp', 'Recreación de una embarcación antigua navegando cerca de la costa.'],
  work: ['premium/assets/curriculum/potter-workshop.jpg', 'Ilustración de una persona que moldea una vasija de barro en un torno.'],
  agora: ['premium/assets/curriculum/athens-agora.jpg', 'Ilustración de personas reunidas junto a puestos en una plaza de Atenas.'],
  today: ['premium/assets/curriculum/textile-looms.jpg', 'A la izquierda se teje en un telar de madera. A la derecha, una máquina moderna teje tela azul.'],
  theatre: ['premium/assets/curriculum/greek-theatre.jpg', 'Ilustración de actores en un espacio abierto frente a personas sentadas en gradas.'],
  games: ['premium/assets/curriculum/olympic-awards.jpg', 'Una corona de hojas de olivo junto a una medalla dorada con cinta azul.'],
};

const pairs = {
  today: [['Antes', 'Telar de madera'], ['Hoy', 'También hay máquinas']],
  games: [['Olimpia', 'Corona de olivo'], ['Juegos actuales', 'Medalla']],
  rights: [['Podían participar', 'Ciudadanos hombres adultos'], ['No podían participar', 'Mujeres, extranjeros y personas esclavizadas']],
  transfer: [['Lo que tienes', 'Una foto de la nueva vasija'], ['Lo que buscas', 'Su lugar de origen y su fecha']],
};

function renderEvidence(task, answer, {icon, asset}, baseVisual) {
  if (task.id === 'trade') return tradeScene(answer, {icon, asset});
  const [title, prompt] = evidence[task.id];
  const scene = scenes[task.id];
  const pair = pairs[task.id];
  const comparison = pair ? `<dl class="evidence-pair">${pair.map(([label, detail]) => `<div><dt>${label}</dt><dd>${detail}</dd></div>`).join('')}</dl>` : '';
  const picture = scene ? `<figure class="lesson-illustration"><img src="${asset(scene[0])}" alt="${scene[1]}" width="960" height="640"><figcaption>Ilustración didáctica</figcaption></figure>` : '';
  const source = !scene && !pair ? baseVisual(task.visual, asset) : '';
  return `<section class="lesson-evidence" aria-labelledby="evidence-title">
    <header class="evidence-heading" id="lesson-evidence-copy"><h2 id="evidence-title">${title}</h2><p>${prompt}</p></header>
    ${picture}${source}${comparison}
  </section>`;
}

function renderResponse(task, answer, correct, icon, esc) {
  if (!answer) return '';
  const index = answer.selected;
  return `<div class="feedback course-feedback response-story" data-result="${correct ? 'correct' : 'reconsider'}" role="status">
    <span class="response-symbol" aria-hidden="true">${icon(correct ? 'clue' : 'compass')}</span>
    <div id="answer-explanation"><strong>${esc(task.results[index])}</strong><p>${esc(task.responses[index])}</p></div>
  </div>
  <button class="button response-listen" data-course-read="feedback">${icon('audio')}Escuchar explicación</button>`;
}

export function renderCourseActivity({unit, unitIndex, task, step, answer, icon, asset, esc, baseVisual}) {
  const correct = answer?.selected === task.correct;
  const lastStep = step === unit.tasks.length - 1;
  return `<section class="course-page course-activity" data-course-theme="${unit.id}" data-activity="${task.id}">
    <header class="course-heading activity-heading">
      <div class="chapter-emblem" aria-hidden="true">${icon(unit.icon)}</div>
      <p class="eyebrow">${unit.title}</p><h1>${task.title}</h1>
      <div class="activity-nav">
        <button class="button" data-course-back>← Volver</button>
        <div class="lesson-progress" aria-label="Paso ${step + 1} de ${unit.tasks.length}">
          ${unit.tasks.map((_, index) => `<span class="${index <= step ? 'filled' : ''} ${index === step ? 'current' : ''}"></span>`).join('')}
          <small>Etapa ${unitIndex + 1} de 5 · Paso ${step + 1} de ${unit.tasks.length}</small>
        </div>
      </div>
    </header>
    <div class="course-layout">
      ${renderEvidence(task, answer, {icon, asset}, baseVisual)}
      <section class="course-task" aria-labelledby="lesson-question">
        <p class="course-context">${task.text}</p>
        <h2 id="lesson-question">${task.question}</h2>
        <div class="activity-audio">
          <button class="button" data-action="speak">${icon('audio')}Escuchar pregunta</button>
          <button class="button" data-course-read="options">${icon('audio')}Escuchar opciones</button>
          <button class="button" id="voice-stop" data-action="stop-voice" hidden>Detener lectura</button>
        </div>
        <div class="choices">${task.options.map((option, index) => {
          const selected = answer?.selected === index;
          const result = selected ? correct ? 'correct' : 'reconsider' : 'idle';
          return `<button class="choice ${selected ? 'selected' : ''}" data-motion-key="course:${task.id}:${index}:${answer?.attempts || 0}" data-answer-state="${result}" data-course-answer="${index}" aria-pressed="${selected}"><span class="answer-number" aria-hidden="true">${selected && correct ? '✓' : index + 1}</span><span>${esc(option)}</span></button>`;
        }).join('')}</div>
        ${renderResponse(task, answer, correct, icon, esc)}
        <div class="activity-help">
          <details class="help" data-course-hint="${task.id}"><summary>Ver una pista</summary><p>${task.hint}</p></details>
          ${task.id === 'trade' ? tradeWords() : ''}
          ${task.id === 'games' ? `<a class="button" href="${asset('apps/olympia/')}">${icon('olive')}Visitar Olimpia</a>` : ''}
        </div>
        <button class="primary" data-course-next ${correct ? '' : 'disabled'}>${lastStep ? 'Guardar hallazgo' : 'Seguir explorando'} →</button>
      </section>
    </div>
  </section>`;
}
