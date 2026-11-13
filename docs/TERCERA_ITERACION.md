# Tercera iteración · Navegación del Egeo

La auditoría visual comparó la versión anterior en Chrome con la misma ventana y los mismos recorridos. Las prioridades fueron integrar los accesos secundarios en la portada, conectar visualmente el salto a Exploración y transformar la lista de etapas en un itinerario legible. Del [Field Guide de Hogwarts Legacy](https://www.harrypotter.com/news/hogwarts-legacy-official-game-guide-out-now) se tomó como referencia el principio de hacer que la navegación pertenezca al mundo del juego. La composición, la brújula, el relieve, la iconografía y los materiales pertenecen a Odisea del Egeo.

## Implementación

- La portada integra un panel de acceso a Olimpia, esculturas y códice. Los dos botones de entrada permanecen junto a la presentación. El panel pasa al flujo de lectura en móvil.
- Exploración comparte la brújula y el marco de imagen con la portada. El marco se desplaza, el panel inferior sale, el índice se revela y la pregunta entra después. La brújula y el texto del encabezado tienen pistas separadas. Al cambiar de estación, el marcador de selección viaja y cada hoja cambia de tonalidad según el lugar.
- La campaña presenta un relieve del Egeo y cinco puntos numerados que corresponden a las etapas. Los puntos reflejan disponibilidad y avance. El foco de una etapa señala el punto correspondiente. La lámina está rotulada como simbólica y los mapas de geografía de las actividades conservan sus fuentes.
- Los ajustes, cuaderno, galería, códice y Olimpia continúan accesibles por sus flujos existentes. Se conservan claves, formato de guardado, desbloqueos, preguntas, evidencias y opciones de accesibilidad.

## Matriz de herramientas

| Herramienta | ¿Instalada? | ¿Utilizada? | Implementación concreta | Evidencia |
| --- | --- | --- | --- | --- |
| Three.js r180 | Sí, vendorizada | Sí | WebGL, carga GLTF, cámaras, OrbitControls, iluminación y sombreado. Se carga al solicitar el visor. Las composiciones de menú no necesitan un contexto 3D. | `premium/world.js`, `premium/god-viewer.js`, `premium/vendor/` |
| React Three Fiber | No | No | La app usa HTML y módulos ES sin React. Se conserva el visor directo de Three.js. | `package.json`, `premium/world.js` |
| View Transition API | Nativa | Sí, avanzada | Instantáneas independientes para brújula, marco, indicador y encabezado. Continuidad espacial, entrada secuenciada y cancelación al navegar. | `premium/menu-motion.js`, `premium/folio-sanctuary.css`, capturas de transición |
| Web Animations API y CSS | Nativas | Sí | Entradas breves, respuestas, máscaras, cambios de estado. Curvas y duraciones del folio compartidas por CSS. | `premium/menu-motion.js`, `premium/folio-tokens.css`, `premium/folio-course.css` |
| [Motion](https://motion.dev/docs/animate) / Framer Motion | No | Evaluado | Motion vanilla podría coordinar secuencias y gestos. Las instantáneas y WAAPI cubren este caso. AnimatePresence requeriría React. | Dependencias e imports del proyecto |
| [GSAP](https://www.gsap.com/docs/v3/GSAP/Timeline/) | No | Evaluado | Una línea de tiempo reversible sería útil para una secuencia interactiva extensa. El cambio actual usa pistas cortas y continuidad por geometría nativa. | `premium/folio-sanctuary.css` |
| [Rive](https://rive.app/docs/runtimes/web/web-js) y CLI | No | Evaluado | No se encontraron archivos `.riv`, runtime ni CLI disponible en PATH. Un recurso con máquina de estados justificaría su uso. | Inventario de dependencias y recursos |
| [PixiJS](https://pixijs.com/guides/components/renderers/) | No | Evaluado | Un renderizador 2D aportaría valor a escenas con muchos sprites. El trazado y sus cinco puntos se dibujan en SVG junto a controles HTML. | `premium/folio-route.js` |
| SVG e iconografía | Nativos | Sí | Rosa de los vientos original, trazado, estaciones numeradas e iconos del proyecto. Se mantienen controles con texto. | `premium/assets/menu/compass-rose.svg`, `premium/ui-icons.js`, `premium/folio-route.js` |
| ImageGen integrado | Herramienta externa al runtime | Sí | Relieve de islas original, JPEG local de 960 × 640 y 161 KB. | `public/premium/assets/menu/aegean-relief.jpg` |
| Playwright | Sí, en el entorno de validación | Sí | Capturas antes y después, comprobaciones de estados y fotogramas de transiciones. | `work/folio-before.mjs`, `work/folio-after.mjs`, `outputs/CAPTURAS_FOLIO/` en la copia local |

## Imagen de la campaña

Prompt usado en ImageGen integrado:

> Landscape 3:2 premium museum exhibit illustration for a primary-school game about ancient Greece, a physical carved relief of Aegean islands on an antique maritime survey table, overhead oblique view with relief hills and sand-colored textured stone shores, dark deep cobalt blue sea made of painted wood. Several distinct natural rocky islands, one tiny ancient Greek merchant sailboat model for scale in lower right, warm raking sidelight from right reveals depth and shadows, tactile crafted materials with occasional subtle bronze pins. Rich restrained navy and ochre, precise calm design, no readable text, no lettering, no numbers, no drawn route lines, no navigational symbols, no logos, no fantasy or existing game references. It is a decorative physical model of an imagined sea, not a map for geographic instruction.

## Revisión y límites

Se corrigieron la alineación de los accesos de portada, la correspondencia entre puntos e índice de la campaña y el cruce de la brújula sobre el texto durante la transición. Playwright verifica transiciones nativas, cambio de lámina, elección de estación, teclado, cuaderno, códice, escultura, campaña y movimiento reducido. También se comprobó Olimpia y pasaron las 43 pruebas existentes y el recorrido de las 14 actividades. Las capturas intermedias representan instantáneas de la transición nativa pausada a tiempos conocidos.

La fluidez se midió mediante intervalos de `requestAnimationFrame` en Chrome en el entorno de prueba. La medición de presentación efectiva en dispositivos del aula y un pilotaje con estudiantes siguen pendientes. Las ilustraciones de la galería 3D, los modelos escultóricos y el contenido histórico de las preguntas corresponden a las entregas previas.
