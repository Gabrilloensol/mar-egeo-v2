import {chapters, publicVideoSource, unitSource} from './greeks-unit.js?v=greeks26';

export function renderChapterIllustration(chapter, asset) {
  const [width, height] = chapter.imageSize ?? [960, 640];
  return `<figure><img src="${asset(chapter.image)}" width="${width}" height="${height}" alt="${chapter.alt}" loading="lazy" decoding="async"><figcaption>${chapter.caption}</figcaption></figure>`;
}

function videoCard(video, icon) {
  const watch = 'https://www.youtube.com/watch?v=' + video.id;
  return `<details class="unit-video"${video.anchor ? ` id="${video.anchor}"` : ''}>
    <summary>${icon('play')}<span><strong>${video.title}</strong><small>${video.duration}</small></span><span class="unit-video-arrow" aria-hidden="true"></span></summary>
    <div class="unit-video-body">
    <p class="unit-video-credit">Teleclases Chile · Corporación Municipal de Iquique</p>
    <p><strong>Mientras miras.</strong> ${video.cue}</p>
    <div class="unit-video-player"><button class="button" type="button" data-unit-video="${video.id}" aria-label="Cargar video: ${video.title}">${icon('play')} Cargar video</button></div>
    <a class="unit-video-link" href="${watch}" target="_blank" rel="noopener">Ver en YouTube ↗</a>
    <ul class="unit-video-moments" aria-label="Momentos para observar">${video.moments.map(([seconds, label]) =>
      `<li><a href="${watch}&amp;t=${seconds}s" target="_blank" rel="noopener"><span class="video-time">${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}</span><span>${label}</span><span aria-hidden="true">↗</span></a></li>`).join('')}</ul>
    <p class="unit-video-question"><strong>Después de mirar.</strong> ${video.check}</p>
    </div></details>`;
}

function chapterPanel(chapter, {icon, asset}) {
  return `<div class="unit-chapter-content">
    <div class="unit-chapter-study">
      ${renderChapterIllustration(chapter, asset)}
      <div class="unit-reading">
        <div class="unit-read-actions"><button class="button" data-unit-read>${icon('audio')} Escuchar el tema</button><button class="button" data-unit-stop hidden>Detener lectura</button></div>
        <div class="unit-ideas">${chapter.ideas.map(([title, text]) => `<div><h3>${title}</h3><p>${text}</p></div>`).join('')}</div>
      </div>
    </div>
    ${chapter.videos ? `<div class="unit-videos"><h3>Videos para observar y conversar</h3>${chapter.videos.map(video => videoCard(video, icon)).join('')}</div>` : ''}
    ${chapter.links ? `<div class="unit-topic-links">${chapter.links.map(([path, title, symbol]) => `<a href="${asset(path)}">${icon(symbol)}${title}<span aria-hidden="true">→</span></a>`).join('')}</div>` : ''}
  </div>`;
}

export function folioCourseMap(units, state, tools, selectedUnit) {
  const {icon, asset} = tools;
  const cover = asset('premium/assets/menu/greek-harbor-cover.jpg');
  const smallCover = asset('premium/assets/menu/greek-harbor-cover-small.jpg');
  const resume = [state.unit, ...units.map((_, index) => index)].find(index => {
    const {tasks} = units[index];
    return tasks.some(task => state.answers[task.id]) && tasks.some(task => !state.answers[task.id]);
  });
  return `<section class="book-page curriculum-home folio-course greeks-unit">
    <header class="unit-cover">
      <div class="unit-cover-copy">
        <p class="eyebrow">Historia · 3.º básico · Unidad 2</p>
        <h1>Los griegos</h1>
        <p>¿Cómo vivían los antiguos griegos y qué aprendemos de ellos hoy?</p>
        <a class="primary" href="#${chapters.place.slug}" data-unit-anchor>Leer el primer tema <span aria-hidden="true">↓</span></a>
      </div>
      <figure class="unit-cover-art">
        <img src="${cover}" srcset="${smallCover} 720w, ${cover} 1400w" sizes="(max-width: 700px) calc(100vw - 32px), 680px" width="1400" height="788" fetchpriority="high" alt="Un puerto imaginado del Egeo, con casas de piedra, un barco a vela y un templo sobre la colina.">
        <figcaption>Un puerto griego del Egeo · Recreación artística</figcaption>
      </figure>
    </header>
    <section class="unit-menu" aria-labelledby="unit-menu-title">
      <h2 id="unit-menu-title">Temas de la unidad</h2>
      <p class="unit-menu-intro">Elige un tema para leer, observar sus fuentes y practicar. Al final puedes explicar una idea con tus palabras.</p>
      ${resume !== undefined ? `<button class="button unit-resume" data-course-continue="${resume}">Retomar práctica de «${units[resume].title}» →</button>` : ''}
      ${units.map((unit,index) => {
        const chapter = chapters[unit.id];
        return `<details class="unit-topic" data-chapter-index="${index}" data-unit-theme="${unit.id}" id="${chapter.slug}" name="temas-griegos"${index===selectedUnit?' open':''}>
          <summary><span class="unit-topic-art" aria-hidden="true"><img src="${asset('premium/assets/menu/topics/' + unit.id + '.jpg')}" alt="" decoding="async"><span class="route-number" data-stage-emblem="${unit.id}">${icon(unit.icon)}</span></span>
            <span class="unit-topic-label"><strong>${unit.title}</strong><span>${unit.summary}</span></span>
            ${chapter.videos ? `<small class="unit-topic-media">${icon('play')}${chapter.videos.length === 1 ? '1 video' : '2 videos'}</small>` : ''}
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
        <li><a href="#vida-y-creencias" data-unit-anchor><strong>Hace unos 2.800 años</strong><span>Se desarrollaron ciudades griegas con sus propias reglas.</span></a></li>
        <li><a href="#lugar-y-tiempo" data-unit-anchor><strong>Hace unos 2.500 años</strong><span>En Atenas se construyó el Partenón y hubo asambleas ciudadanas.</span></a></li>
        <li><a href="#legado-griego" data-unit-anchor><strong>Hoy</strong><span>El teatro, los juegos y otras ideas griegas siguen presentes con cambios.</span></a></li>
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
