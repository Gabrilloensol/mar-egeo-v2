import {chapters, publicVideoSource, unitSource} from './greeks-unit.js?v=greeks25';

function videoCard(video, icon) {
  const watch = 'https://www.youtube.com/watch?v=' + video.id;
  return `<details class="unit-video"${video.anchor ? ` id="${video.anchor}"` : ''}>
    <summary>${icon('play')}<span><strong>${video.title}</strong><small>${video.duration}</small></span></summary>
    <div class="unit-video-body">
    <p class="unit-video-credit">Teleclases Chile · Corporación Municipal de Iquique</p>
    <p><strong>Mientras miras.</strong> ${video.cue}</p>
    <div class="unit-video-player"><button class="button" type="button" data-unit-video="${video.id}" aria-label="Cargar video: ${video.title}">${icon('play')} Cargar video</button></div>
    <a class="unit-video-link" href="${watch}" target="_blank" rel="noopener">Ver en YouTube ↗</a>
    <ul class="unit-video-moments" aria-label="Momentos para observar">${video.moments.map(([seconds, label]) =>
      `<li><a href="${watch}&amp;t=${seconds}s" target="_blank" rel="noopener">${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')} · ${label} ↗</a></li>`).join('')}</ul>
    <p><strong>Después de mirar.</strong> ${video.check}</p>
    </div></details>`;
}

function chapterPanel(chapter, {icon, asset}) {
  return `<div class="unit-chapter-content">
    <div class="unit-read-actions"><button class="button" data-unit-read>${icon('audio')} Escuchar el tema</button><button class="button" data-unit-stop hidden>Detener lectura</button></div>
    <div class="unit-chapter-study">
      <div class="unit-ideas">${chapter.ideas.map(([title, text]) => `<div><h3>${title}</h3><p>${text}</p></div>`).join('')}</div>
      <figure><img src="${asset(chapter.image)}" alt="${chapter.alt}" loading="lazy" decoding="async"><figcaption>${chapter.caption}</figcaption></figure>
    </div>
    ${chapter.videos ? `<div class="unit-videos"><h3>Videos para observar y conversar</h3>${chapter.videos.map(video => videoCard(video, icon)).join('')}</div>` : ''}
    ${chapter.links ? `<div class="unit-topic-links">${chapter.links.map(([path, title, symbol]) => `<a href="${asset(path)}">${icon(symbol)}${title}<span aria-hidden="true">→</span></a>`).join('')}</div>` : ''}
  </div>`;
}

export function folioCourseMap(units, state, tools, selectedUnit) {
  const {icon} = tools;
  const resume = [state.unit, ...units.map((_, index) => index)].find(index => {
    const {tasks} = units[index];
    return tasks.some(task => state.answers[task.id]) && tasks.some(task => !state.answers[task.id]);
  });
  return `<section class="book-page curriculum-home folio-course greeks-unit">
    <header class="unit-cover">
      <div><p class="eyebrow">HISTORIA · 3.º BÁSICO · UNIDAD 2</p><h1>Los griegos</h1><p>¿Cómo vivían los antiguos griegos y qué aprendemos de ellos hoy?</p></div>
      <a class="button" href="#${chapters.place.slug}">Leer el primer tema ↓</a>
    </header>
    <section class="unit-menu" aria-labelledby="unit-menu-title">
      <h2 id="unit-menu-title">Temas de la unidad</h2>
      <p class="unit-menu-intro">Elige un tema para leer, observar sus fuentes y practicar. Al final puedes explicar una idea con tus palabras.</p>
      ${resume !== undefined ? `<button class="button unit-resume" data-course-continue="${resume}">Retomar práctica de «${units[resume].title}» →</button>` : ''}
      ${units.map((unit,index) => {
        const chapter = chapters[unit.id];
        return `<details class="unit-topic" data-chapter-index="${index}" id="${chapter.slug}" name="temas-griegos"${index===selectedUnit?' open':''}>
          <summary><span class="route-number" data-stage-emblem="${unit.id}" aria-hidden="true">${icon(unit.icon)}<b>${index+1}</b></span>
            <span class="unit-topic-label"><strong>${unit.title}</strong><span>${unit.summary}${chapter.videos ? ` · ${chapter.videos.length === 1 ? '1 video' : '2 videos'}` : ''}</span></span>
            <span class="unit-topic-arrow" aria-hidden="true"></span>
          </summary>
          ${chapterPanel(chapter,tools)}
          <div class="unit-chapter-action">
            <p class="unit-prompt">${icon('question')}<span>${chapter.prompt}</span></p>
            <button class="primary" data-course-unit="${index}">Practicar este tema <span aria-hidden="true">→</span></button>
            <button class="button" data-course-reflect="${index}">Explicar con mis palabras</button>
          </div>
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
      <details><summary>Actividades complementarias</summary><button class="button" data-action="practice">Consultar actividades</button></details>
    </footer>
  </section>`;
}
