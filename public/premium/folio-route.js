// An original itinerary diagram. The relief behind it is illustrative.
function routeDiagram(stages) {
  const points = [[90,321],[213,251],[349,232],[433,163],[524,73]];
  return `<svg class="folio-course-trace" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
    <path class="folio-trace-shadow" d="M90 321Q169 335 213 251T349 232Q427 252 433 163T524 73"/>
    <path class="folio-trace-line" pathLength="1" d="M90 321Q169 335 213 251T349 232Q427 252 433 163T524 73"/>
    ${stages.map(({unit,index,status}) => `<g class="folio-marker" data-marker-stage="${unit.id}" data-route-state="${status}" transform="translate(${points[index].join(' ')})"><circle r="14"/><text dy=".35em">${index+1}</text></g>`).join('')}
  </svg>`;
}

export function folioCourseMap(units, state, {icon, asset}, {unitDone, unitOpen, courseDone}) {
  const pending = units.findIndex((_, index) => !unitDone(state, index));
  const resume = pending < 0 ? units.length - 1 : pending;
  const count = units.filter((_, index) => unitDone(state, index)).length;
  const start = Object.keys(state.answers).length === 0;
  const title = courseDone(state) ? 'Volver a mis hallazgos' : start ? 'Empezar mi viaje' : 'Continuar mi viaje';
  const stages = units.map((unit, index) => {
    const done = unitDone(state,index);
    const available = unitOpen(state,index);
    return {unit,index,available,status:done ? 'done' : available ? 'open' : 'later'};
  });
  return `<section class="book-page curriculum-home folio-course">
    <header class="folio-course-head">
      <div><p class="eyebrow">GRECIA ANTIGUA · 3.º BÁSICO</p><h1>Tu ruta por Grecia</h1><p>${count} de ${units.length} etapas recorridas</p></div>
      <button class="primary" data-course-continue="${resume}">${title} →</button>
    </header>
    <div class="folio-course-layout">
      <figure class="folio-course-chart">
        <div class="folio-course-image"><img src="${asset('premium/assets/menu/aegean-relief.jpg')}" width="960" height="640" alt="Relieve artístico de islas rocosas sobre un mar azul oscuro" fetchpriority="high">${routeDiagram(stages)}</div>
        <figcaption>Relieve imaginado del Egeo · ruta simbólica</figcaption>
      </figure>
      <ol class="curriculum-route" aria-label="Etapas de la aventura">${stages.map(({unit,index,available,status}) => {
        const label = status==='done' ? 'Recorrida' : available ? 'Disponible' : 'Más adelante';
        return `<li data-route="${unit.id}" data-route-state="${status}">
          <button data-course-unit="${index}" ${available ? '' : 'disabled'}>
            <span class="route-number"><span class="folio-route-index">${index+1}</span></span>
            <span><strong>${unit.title}</strong><small>${unit.summary}</small></span>
            <small class="folio-route-status">${label}</small>
          </button>
        </li>`;
      }).join('')}</ol>
    </div>
    <div class="folio-course-links">
      <a class="olympia-entry" href="${asset('apps/olympia/')}">${icon('olive')}<span><strong>Los Juegos Olímpicos</strong><small>Visita Olimpia y compara los juegos de antes y de hoy.</small></span><span aria-hidden="true">→</span></a>
      <details class="help"><summary>Explorar y practicar más</summary><p>Recorre las etapas en distintas sesiones y revisa tus hallazgos con tu docente.</p><div class="actions"><button class="button" data-action="practice">Misiones de práctica</button><a class="button" href="${asset('?escultura=zeus&volver=aventura')}">Galería de dioses</a></div></details>
      <button class="button" data-action="teacher">Guía docente</button>
    </div>
  </section>`;
}
