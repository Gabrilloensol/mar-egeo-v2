# Interfaz de Odisea del Egeo · Iteración 23

## Auditoría y decisiones

| Hallazgo en la versión 22 | Cambio en la versión 23 |
| --- | --- |
| El recorrido tenía un mapa ilustrado y una lista uniforme. El progreso era solo texto. | El mapa y su lista comparten números. Cada etapa tiene un símbolo, el siguiente destino se distingue en la lista y el progreso usa un medidor con texto. |
| El encabezado repetía la jerarquía del panel derecho y la explicación quedaba al final de todas las opciones. | La pregunta encabeza la página, la evidencia y las opciones ocupan columnas propias, y la explicación se abre junto a la elección. El reintento usa el ojo y el acierto una marca de confirmación y un símbolo del tema. |
| El mapa, el cuaderno y los ajustes tenían tratamientos independientes. | La navegación conserva su posición y estado. El cuaderno tiene una portada ilustrada y un registro por etapa. Opciones organiza los controles de accesibilidad y el guardado en dos áreas. |
| Olimpia y el repaso del santuario indicaban estados principalmente con color. | Las opciones tienen numeración y estados de icono. Olimpia muestra la explicación junto a la elección, y el santuario identifica el resultado con el mismo vocabulario visual. |

## Herramientas

| Herramienta | Uso y decisión |
| --- | --- |
| View Transition API y Web Animations | Se reutiliza `premium/menu-motion.js`. En el recorrido se captura el contenido que cambia y el emblema de la etapa puede viajar entre la ruta y el encabezado. La navegación queda operable durante el efecto. Web Animations proporciona la entrada alternativa y anima la explicación de Olimpia. [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using) |
| CSS y SVG | `premium/voyage-interface.css` concentra la composición, estados de selección y tiempos de la interfaz. `premium/ui-icons.js` proporciona trazos originales. Los cambios de respuesta tienen una apertura corta de 240–310 ms y la transición de sección dura 290 ms. |
| ImageGen | Portada `public/premium/assets/menu/field-notebook.jpg`. Bodegón imaginado de una tablilla encerada, estilete, papiro, rama de olivo y fragmento de cerámica con luz cálida sobre lino oscuro. Recurso decorativo, 1140 × 760, JPEG. |
| Three.js | Módulo local utilizado por `world.js` y `god-viewer.js` para la isla y las esculturas. La animación de interfaz conserva el DOM y sus controles. [Three.js](https://threejs.org/manual/en/fundamentals.html) |
| Motion y GSAP | Evaluados para continuidad espacial y secuencias. La transición nativa ya resuelve el emblema compartido, y las secuencias de esta versión caben en CSS y WAAPI. [Motion](https://motion.dev/docs/layout-animations) · [GSAP](https://gsap.com/docs/v3/GSAP/Timeline/) |
| Rive y PixiJS | Evaluados para estados de ilustración y escenas 2D. Los iconos necesitan pocos estados y los controles deben seguir siendo elementos HTML. El repositorio no requiere un lienzo 2D adicional ni un recurso `.riv` para estos flujos. [Rive](https://rive.app/docs/runtimes/state-machines) · [PixiJS](https://pixijs.com/8.x/guides/components/scene-objects) |
| Playwright con Chromium | Capturas antes y después, transiciones nativas, foco por teclado, reintento, acierto, tamaño de texto, contraste y movimiento reducido. |

## Verificación y límites

Se recorrieron las 14 actividades y se comprobaron las 42 explicaciones posibles. En Chromium se revisaron el mapa, la pregunta, el cuaderno, las opciones, Olimpia, la exploración ilustrada y el repaso. Se mantuvieron la ficha visible del ánfora y la imagen de la asamblea. La transición se omite con la preferencia de movimiento reducido de la aplicación o del sistema.

Las capturas de escritorio y móvil muestran composición y legibilidad en el entorno probado. Sigue pendiente medir la frecuencia de cuadros en computadores escolares, probar la voz del navegador en equipos del aula y observar la experiencia con estudiantes.
