import {chapters, publicVideoSource, unitSource} from './greeks-unit.js?v=greeks24';

function videoCard(video, icon) {
  const watch = 'https://www.youtube.com/watch?v=' + video.id;
  return `<section class="unit-video" aria-label="Video: ${video.title}">
    <p class="unit-video-credit">Teleclases Chile · Corporación Municipal de Iquique · ${video.duration}</p>
    <h3>${video.title}</h3>
    <p><strong>Mientras miras.</strong> ${video.cue}</p>
    <div class="unit-video-player"><button class="button" type="button" data-unit-video="${video.id}" aria-label="Cargar video: ${video.title}">${icon('play')} Cargar video</button></div>
    <a class="unit-video-link" href="${watch}" target="_blank" rel="noopener">Ver en YouTube ↗</a>
    <ul class="unit-video-moments" aria-label="Momentos para observar">${video.moments.map(([seconds, label]) =>
      `<li><a href="${watch}&amp;t=${seconds}s" target="_blank" rel="noopener">${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')} · ${label} ↗</a></li>`).join('')}</ul>
    <p><strong>Después de mirar.</strong> ${video.check}</p>
  </section>`;
}

function chapterPanel(chapter, {icon, asset}) {
  return `<div class="unit-chapter-content">
    <div class="unit-chapter-study">
      <div class="unit-ideas">${chapter.ideas.map(([title, text]) => `<div><h3>${title}</h3><p>${text}</p></div>`).join('')}</div>
      <figure><img src="${asset(chapter.image)}" alt="${chapter.alt}" loading="lazy" decoding="async"><figcaption>${chapter.caption}</figcaption></figure>
    </div>
    <p class="unit-prompt">${icon('question')}<span>${chapter.prompt}</span></p>
    ${chapter.video ? videoCard(chapter.video, icon) : ''}
    ${chapter.links ? `<div class="unit-topic-links">${chapter.links.map(([path, title, symbol]) => `<a href="${asset(path)}">${icon(symbol)}${title}<span aria-hidden="true">→</span></a>`).join('')}</div>` : ''}
  </div>`;
}

export function folioCourseMap(units, state, tools, {unitDone, unitOpen, courseDone}, selectedUnit) {
  const {icon} = tools;
  const pending = units.findIndex((_, index) => !unitDone(state, index));
  const resume = pending < 0 ? units.length - 1 : pending;
  const count = units.filter((_, index) => unitDone(state, index)).length;
  const active = selectedUnit;
  const started = Object.keys(state.answers).length > 0;
  const title = courseDone(state) ? 'Volver a mi investigación' : started ? 'Continuar las actividades' : 'Empezar las actividades';
  return `<section class="book-page curriculum-home folio-course greeks-unit">
    <header class="unit-cover">
      <div><p class="eyebrow">HISTORIA · 3.º BÁSICO · UNIDAD 2</p><h1>Los griegos</h1><p>¿Cómo vivían los antiguos griegos y qué aprendemos de ellos hoy?</p></div>
      <div class="unit-cover-actions"><div class="route-completion"><progress value="${count}" max="${units.length}" aria-label="Temas practicados"></progress><span>${count} de ${units.length} temas practicados</span></div><button class="primary" data-course-continue="${resume}">${title} →</button></div>
    </header>
    <section class="unit-menu" aria-labelledby="unit-menu-title">
      <h2 id="unit-menu-title">Temas de la unidad</h2>
      <p class="unit-menu-intro">Abre cualquier tema para leerlo. Las actividades siguen el orden del menú.</p>
      ${units.map((unit,index) => {
        const chapter = chapters[unit.id];
        const done = unitDone(state,index);
        const available = unitOpen(state,index);
        return `<details class="unit-topic" data-chapter-index="${index}" id="${chapter.slug}" name="temas-griegos"${index===active?' open':''}>
          <summary><span class="route-number" data-stage-emblem="${unit.id}" aria-hidden="true">${icon(unit.icon)}<b>${index+1}</b></span>
            <span class="unit-topic-label"><strong>${unit.title}</strong><span>${unit.summary}${chapter.video ? ' Incluye video.' : ''}</span></span>
            <span class="unit-topic-arrow" aria-hidden="true"></span>
          </summary>
          ${chapterPanel(chapter,tools)}
          <div class="unit-read-actions"><button class="button" data-unit-read>${icon('audio')} Escuchar el tema</button><button class="button" data-unit-stop hidden>Detener lectura</button></div>
          <div class="unit-chapter-action"><button class="primary" data-course-unit="${index}" ${available?'':'disabled'}>${done?'Repasar actividades':'Hacer las actividades'} <span aria-hidden="true">→</span></button>${!available?`<p>Para abrir estas actividades, termina «${units[index-1].title}».</p>`:''}</div>
        </details>`;
      }).join('')}
    </section>
    <section class="unit-context" aria-labelledby="unit-context-title">
      <h2 id="unit-context-title">Del mar Egeo a nuestros días</h2>
      <ol>
        <li><strong>Hace unos 2.800 años</strong><span>Se desarrollaron ciudades griegas con sus propias reglas.</span></li>
        <li><strong>Hace unos 2.500 años</strong><span>En Atenas se construyó el Partenón y hubo asambleas ciudadanas.</span></li>
        <li><strong>Hoy</strong><span>El teatro, los juegos y otras ideas griegas siguen presentes con cambios.</span></li>
      </ol>
    </section>
    <footer class="unit-teacher-links">
      <a href="${unitSource}" target="_blank" rel="noopener">Unidad oficial del Mineduc ↗</a>
      <a href="${publicVideoSource}" target="_blank" rel="noopener">Programa educativo municipal Teleclases ↗</a>
      <button class="button" data-action="teacher">Guía docente</button>
      <details><summary>Más actividades de práctica</summary><button class="button" data-action="practice">Abrir las misiones de práctica</button></details>
    </footer>
  </section>`;
}
