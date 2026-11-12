# Segunda iteración visual de Odisea del Egeo

## Tres oportunidades

1. La portada dividía el texto y el paisaje en dos bloques equivalentes. Ahora la ilustración ocupa el escenario completo en escritorio, con la luz concentrada en el santuario y el texto sobre el mar oscuro. En móvil, el paisaje introduce la pantalla y las acciones quedan debajo, en orden de lectura.
2. La barra horizontal competía con la actividad en escritorio. El atlas tiene un índice lateral, una lámina de observación y una hoja de trabajo clara. Al reducir el ancho, el índice se coloca encima de la lámina. La ilustración y la fotografía del templo conservan sus rótulos y fuentes.
3. Las vistas secundarias perdían la identidad de las pantallas principales. El códice, el cuaderno, la galería y los ajustes comparten tipografía, líneas, superficies y estados de foco. La campaña adopta una ruta continua con una fila por etapa y conserva los colores que distinguen sus actividades.

## Materiales y componentes

Azul tinta `#091923` para el espacio, latón `#e7ca8e` para selección, lino `#e9dfca` para preguntas de Exploración y marfil para títulos sobre fondo oscuro. La portada aprovecha la panorámica original de la primera iteración. Los créditos y el prompt de esa imagen están en el [documento de la primera entrega](DISENO_PORTADA_EXPLORACION.md). Cormorant Garamond marca los títulos y se conserva la familia del sistema para controles y texto continuo. Los controles usan la familia original de iconos del proyecto con rótulos visibles.

## Coreografía

| Momento | Relación visual y función |
| --- | --- |
| Portada inicial | Título, contexto, acciones y accesos secundarios aparecen en ese orden. Los comienzos están separados por 60, 105 y 145 ms respecto al título. |
| Portada ↔ Exploración | La lámina cambia de escala y posición. El encabezado, el índice y la hoja de trabajo tienen pistas separadas para que su entrada siga el orden de lectura. |
| Cambio de estación | El indicador de selección recorre el índice. Se conserva la posición de la lámina y la hoja de trabajo se revela después de elegir el lugar. |
| Cambio de lámina | Se cruzan las imágenes dentro del mismo marco. El texto de la actividad queda quieto. |
| Ventanas | El diálogo nativo conserva el foco, Escape y la capa superior. La apertura asienta la superficie en 220 ms y luego entra el título. El cierre retira la superficie. |
| Respuesta | El estado queda escrito y se distingue por borde y superficie. El progreso cambia al incorporar un hallazgo. |

Las secuencias son finitas. La vista ilustrada funciona sin WebGL y el oleaje permanece dentro del visor 3D. El sistema y la preferencia de la app pueden reducir el movimiento. La lectura y el control por teclado se mantienen en HTML.

## Motores revisados

| Herramienta | Decisión de esta iteración |
| --- | --- |
| [Three.js](https://threejs.org/docs/pages/WebGLRenderer.html) | Es el motor existente del santuario y las esculturas. Se conserva su inicialización diferida. |
| [Motion](https://motion.dev/docs/animate) | Sus secuencias y control de gestos se evaluaron. La interfaz actual requiere pistas cortas y estados simples que cubre WAAPI. |
| [GSAP](https://www.gsap.com/docs/v3/GSAP/Timeline/) | La edición y el control de líneas de tiempo ofrecen valor para escenas con varias ramas. La navegación actual se resuelve con instantáneas nativas y secuencias de pocas pistas. |
| [Rive](https://rive.app/docs/runtimes/web/web-js) | Puede servir para un personaje o artefacto animado con estados propios. Esta fase trabaja con ilustraciones y controles HTML. |
| [PixiJS](https://pixijs.com/guides/components/renderers/) | Su renderizador 2D tendría sentido para una escena interactiva con muchos sprites. Esta interfaz presenta una lámina y un conjunto pequeño de controles semánticos. |

View Transition API coordina la geometría compartida. Web Animations API secuencia entradas y respuestas. CSS maneja la interacción inmediata y los diálogos. Los tres mecanismos tienen responsabilidades distintas y no se añadió una dependencia de animación.

## Verificación e iteración

Playwright ejecutó Chrome a 1.440 × 900 y 390 × 844. Se comprobó también el texto al 130 % a 320 px. La prueba recorrió la portada, dos estaciones, respuestas correctas y de revisión, la ida y vuelta del visor 3D, la selección del códice, la carga de una escultura, el cuaderno y la entrada a la primera actividad de la campaña. También comprobó que el modo de movimiento reducido no ejecutara las transiciones del atlas.

Las capturas revelaron que el encabezado del códice podía desaparecer al desplazar su contenido. El encabezado y el cierre permanecen visibles en la revisión final. Se aumentó el tamaño del texto de Anterior y Siguiente en las láminas y se capturó la campaña después de terminar su entrada.

Chrome en el entorno de prueba registró un intervalo mediano de 8,3 ms entre callbacks de fotograma en dos transiciones nativas. Las 43 pruebas existentes, la comprobación del recorrido de 14 actividades y la de las cuatro estaciones pasaron. La siguiente iteración debería medir tiempos en los equipos del aula y observar a estudiantes al comparar la ilustración y la foto en móvil.
