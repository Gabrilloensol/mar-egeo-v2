const outcomes = {
  ready: {title:'Dos islas, dos puertos', summary:'Tenemos aceite. En el otro puerto tienen trigo.', home:'Tenemos aceite', other:'Tienen trigo', result:'Elige qué hacer para conseguir trigo.'},
  store: {title:'El aceite se queda en casa', summary:'Guardamos el aceite en nuestro puerto.', home:'Aceite guardado', other:'El trigo sigue allí', result:'No sale ningún barco. Aún nos falta trigo.'},
  exchange: {title:'Los barcos llevan el intercambio', summary:'Enviamos parte del aceite y recibimos trigo.', home:'Recibimos trigo', other:'Reciben aceite', result:'Ahora podemos usar el trigo para hacer harina.'},
  pots: {title:'Más vasijas en nuestro puerto', summary:'Ahora podemos guardar más aceite.', home:'Aceite y más vasijas', other:'El trigo sigue allí', result:'No sale ningún barco. Aún nos falta trigo.'},
};

function crossings() {
  return `<svg class="trade-crossings" viewBox="0 0 960 640" aria-hidden="true" focusable="false">
    <g class="trade-crossing trade-crossing-oil">
      <path d="M340 321 Q459 253 577 321" pathLength="1"/>
      <path class="trade-arrowhead" d="m557 298 24 25-35 1z"/>
    </g>
    <g class="trade-crossing trade-crossing-grain">
      <path d="M577 350 Q459 418 340 350" pathLength="1"/>
      <path class="trade-arrowhead" d="m360 373-24-25 35-1z"/>
    </g>
  </svg>`;
}

function tradeRoutes(icon) {
  return `<ul class="trade-route-key" aria-label="Dirección del intercambio">
    <li class="trade-route-oil">${icon('amphora')}<div><strong>Aceite <i aria-hidden="true">→</i></strong><span>De nuestro puerto al otro puerto.</span></div></li>
    <li class="trade-route-grain">${icon('wheat')}<div><strong><i aria-hidden="true">←</i> Trigo</strong><span>Del otro puerto a nuestro puerto.</span></div></li>
  </ul>`;
}

export function tradeScene(answer, {asset, icon}) {
  const state = ['store','exchange','pots'][answer?.selected] || 'ready';
  const result = outcomes[state];
  const exchange = state === 'exchange';
  return `<section class="trade-scene" data-trade-state="${state}" aria-labelledby="trade-scene-title">
    <div id="trade-support-text" class="trade-reading">
      <header class="trade-heading"><h2 id="trade-scene-title">${result.title}</h2><p>${result.summary}</p></header>
      <figure class="trade-chart">
        <div class="trade-water"><img src="${asset('premium/assets/curriculum/trade-islands.jpg')}" width="960" height="640" alt="Dos islas imaginadas separadas por un canal de mar. Nuestro puerto está a la izquierda y el otro puerto a la derecha.">${exchange ? crossings() : ''}</div>
        <figcaption>Dos islas imaginadas del Egeo · carta ilustrada</figcaption>
      </figure>
      <div class="trade-ports">
        <div class="trade-port">${icon(exchange?'wheat':'amphora')}<div><strong>Nuestro puerto</strong><span>${result.home}</span></div></div>
        <div class="trade-port">${icon(exchange?'amphora':'wheat')}<div><strong>Otro puerto</strong><span>${result.other}</span></div></div>
      </div>
      ${exchange ? tradeRoutes(icon) : ''}
      <p class="harbor-outcome">${result.result}</p>
    </div>
    <div class="trade-controls"><button class="button" data-course-read="support">${icon('audio')}Escuchar la escena</button></div>
  </section>`;
}
