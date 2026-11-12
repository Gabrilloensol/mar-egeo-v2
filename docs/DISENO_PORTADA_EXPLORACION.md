# Portada y Exploración de Odisea del Egeo

La primera entrega cubre la portada del santuario y las cuatro estaciones de Exploración. Usa el azul tinta del Egeo, marfil de piedra y latón para guiar la mirada. La portada presenta un paisaje enmarcado y dos decisiones principales. Exploración usa una barra continua para elegir el lugar y una composición de evidencia y pregunta. Los paneles de esta sección conservan superficies mates para que los materiales y la luz de las ilustraciones destaquen.

## Auditoría y herramientas

El sitio sirve HTML estático, CSS y módulos ES nativos. Los estados de la aventura y del santuario se guardan por separado. Los principales problemas eran la competencia entre la escena 3D y la acción principal, el texto repartido en demasiados estilos, el mismo contorno de tarjeta en casi todos los controles y cambios de estación sin continuidad perceptible. La escena del santuario también comenzaba a cargar en la portada aunque el visitante fuera a entrar a la aventura o al cuaderno.

| Herramienta | Evaluación |
| --- | --- |
| [Motion para JavaScript](https://motion.dev/docs/animate) | Compatible con módulos ES. Su versión ligera se apoya en WAAPI. Útil si se necesita una biblioteca de gestos o secuencias más complejas. |
| [GSAP](https://www.gsap.com/docs/v3/GSAP/) | Compatible con JavaScript sin framework. Las líneas de tiempo y el control de reproducción serían útiles para secuencias extensas. |
| [Rive para web](https://rive.app/docs/runtimes/web/web-js) | Adecuado para piezas animadas con estados en un archivo Rive. Añadiría un runtime y un flujo de edición para los controles de este alcance. |
| [Three.js](https://threejs.org/docs/pages/GLTFLoader.html) | Se conserva la copia que ya mueve las cámaras y carga GLB. El santuario se inicia al pedir la vista 3D. |
| [PixiJS](https://pixijs.com/guides/components/renderers/) | Compatible como renderizador 2D de canvas. Las ilustraciones y los controles semánticos de estas pantallas se resuelven en el DOM. |
| [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) y [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) | Solución adoptada para transiciones, animaciones breves y cancelación. La navegación funciona de forma inmediata cuando faltan las APIs o se reduce el movimiento. |

## Componentes y reglas

| Elemento | Regla |
| --- | --- |
| Superficies | Fondo `#0b1c24`, panel `#132a34`, texto `#f5edda`, texto secundario `#c1cecb`, latón `#e5c98c`. El latón destaca acciones primarias y selección. |
| Tipografía | Cormorant Garamond seminegrita para títulos y preguntas. Familia del sistema para controles y texto continuo. WOFF2 local con [licencia OFL](../public/premium/assets/type/OFL-Cormorant-Garamond.txt). |
| Navegación | Marca de inicio, controles HTML y biblioteca propia de iconos con rótulos. La estación elegida usa subrayado y estado accesible. El visto indica un hallazgo guardado. |
| Evidencia | La imagen mantiene su encuadre. La foto del Partenón tiene pie y créditos propios. La ilustración lleva rótulo visible. |
| Entradas | Portada y estaciones reutilizan marco, espaciado, línea y comportamiento de botones. En pantallas estrechas se apilan las columnas y la barra usa dos estaciones por fila. |

## Movimiento

| Evento | Función y duración |
| --- | --- |
| Portada ↔ Exploración | El marco de imagen mantiene continuidad entre las posiciones y la barra principal permanece fija en la transición. 380 ms. |
| Cambio de estación | La línea indica el nuevo destino, cambia la imagen y la pregunta entra con un desplazamiento de 8 px. 280 ms para la geometría. |
| Cambio de imagen | El marco permanece en su lugar mientras se cruzan las imágenes. |
| Botón | Una pulsación de 1 px y cambio de color en 140 ms. El foco mantiene un contorno visible. |
| Respuesta | La confirmación asienta el hallazgo en 320 ms. La revisión aparece en 190 ms con un desplazamiento menor. La explicación queda escrita. |

La curva de llegada es `cubic-bezier(.22, 1, .36, 1)`. Los estados finales se aplican mediante el flujo normal de la app. Una nueva navegación cancela la transición anterior. Las animaciones de interfaz son finitas. La única animación ambiental continua permanece en el visor 3D cuando está activo. El modo de movimiento reducido cancela transiciones y elimina el desplazamiento visual.

## Validación

Playwright ejecutó el sitio en Chrome con un perfil aislado. Se comprobaron portada y Exploración a 1.440 × 900 y 390 × 844, texto al 130 % a 320 px, selección de estación, acierto y revisión, y entrada y regreso del visor 3D. La prueba confirmó que el modelo y la panorámica de respaldo se solicitan al abrir el visor. Las capturas posteriores a la revisión muestran el pie de portada al final de la pantalla sin cubrir controles.

Chrome sin interfaz gráfica ejecutó las transiciones nativas de sección y estación. El intervalo mediano entre callbacks de `requestAnimationFrame` fue de 9,6 y 9,7 ms respectivamente. Son observaciones del entorno de prueba. Para confirmar el rendimiento en aula hace falta medir en sus equipos.

## Imagen de portada

ImageGen integrado. Archivo optimizado `public/premium/assets/menu/aegean-sanctuary.jpg`, 1.200 × 800. La copia original se conserva en el área de imágenes generadas.

> Original cinematic key art for a premium educational adventure about ancient Greece, 3:2 landscape composition. A small, historically plausible painted Doric sanctuary on a rocky Aegean island in late afternoon, seen from slightly above the water and very far enough to see the entire rocky headland, never from the temple stairs. Main sanctuary and sunlit limestone entirely on the right half, blue-green Aegean water and soft distant hills on left half with low detail as negative space. One tiny believable Greek merchant sailing vessel at base of headland for scale. The distant horizon in upper third, deep ink-blue sea, subdued copper and pale limestone, local dry olive brush. Beautiful atmospheric perspective, naturalistic light, realistic landscape painting with film still detail, unmistakable Mediterranean. No words, letters, framing, fantasy, glowing magical elements, large foreground people, or resemblance to an existing game asset. It is an illustrative reconstruction, not a specific archaeological site.
