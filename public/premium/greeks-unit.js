// Student-facing chapter introductions. Activity IDs and saved answers live in curriculum.js.
export const chapters = {
  place: {
    slug: 'lugar-y-tiempo',
    title: 'Grecia antigua: lugar y tiempo',
    summary: 'Ubica Grecia y distingue la Antigüedad del presente.',
    image: 'premium/assets/curriculum/parthenon-2008.jpg',
    imageSize: [960, 704],
    alt: 'Columnas del Partenón, en la Acrópolis de Atenas.',
    caption: 'El Partenón de Atenas · Fotografía de 2008 · Kallistos / Neokortex, CC BY 3.0',
    ideas: [
      ['¿Dónde vivían?', 'En el sureste de Europa, alrededor del mar Egeo. Allí hay una península, muchas islas y montañas. También hubo comunidades griegas en la costa de Asia Menor.'],
      ['¿Cuándo?', 'La historia de los griegos antiguos duró muchos siglos. El Partenón es de una época que llamamos Grecia clásica, hace unos 2.500 años.'],
    ],
    prompt: 'Ubica Grecia en el mapa. Después explica cómo una fotografía reciente puede mostrar un edificio antiguo.',
  },
  sea: {
    slug: 'mar-y-comercio',
    title: 'El mar Egeo y el comercio',
    summary: 'Explica cómo el relieve y el mar influyeron en su vida.',
    image: 'premium/assets/curriculum/trade-islands.jpg',
    alt: 'Dos puertos en islas rocosas separadas por un canal.',
    caption: 'Dos puertos del Egeo · Ilustración didáctica',
    ideas: [
      ['Las montañas', 'En muchas zonas había poco terreno plano. Los griegos cultivaban donde podían y obtenían productos como aceitunas y uvas.'],
      ['El mar como camino', 'Por mar llevaban productos a otros puertos. Por ejemplo, una ciudad podía ofrecer aceite y recibir trigo. También se fundaron nuevas comunidades griegas en otras costas del Mediterráneo. Así se extendieron sus intercambios y algunas de sus costumbres.'],
    ],
    prompt: 'Si en tu puerto sobra aceite y falta trigo, ¿cómo puede ayudar un barco?',
  },
  daily: {
    slug: 'vida-y-creencias',
    title: 'Ciudades, vida diaria y creencias',
    summary: 'Descubre la polis, los oficios, los templos y los mitos.',
    image: 'premium/assets/curriculum/athens-agora.jpg',
    alt: 'Personas conversan y comercian en una plaza de Atenas.',
    caption: 'El ágora o plaza de reunión · Recreación artística',
    ideas: [
      ['Ciudades con sus propias reglas', 'Una polis era una ciudad con sus tierras cercanas y su propio gobierno. Atenas y Esparta eran dos polis. Compartían la lengua griega y muchas creencias, aunque se organizaban de manera distinta.'],
      ['La vida en la ciudad', 'En el ágora, una plaza pública, había mercados y encuentros. En los talleres se hacían vasijas y telas. Los templos eran lugares dedicados a los dioses.'],
      ['Dioses, relatos y fiestas', 'Creer en varios dioses se llama politeísmo. En sus mitos, muchos dioses vivían en el monte Olimpo. Zeus se relacionaba con el cielo y Poseidón con el mar. Los griegos honraban a sus dioses con ofrendas y fiestas. Los juegos de Olimpia se celebraban en honor a Zeus.'],
    ],
    prompt: 'Elige un mercado, un taller o un templo. ¿Qué hacía la gente en ese lugar? Dibuja una pista que lo muestre.',
    links: [
      ['?explorar=1&volver=creencias', 'Explorar un santuario griego', 'temple'],
      ['?escultura=zeus&volver=creencias', 'Observar los dioses en 3D', 'gallery'],
    ],
    videos: [{
      id: '1osZElvXIEc', title: 'La religión de los griegos', duration: '7 min 31 s',
      moments: [[100, 'La Acrópolis y sus restos'], [175, 'Ilustraciones de los dioses']],
      cue: 'Cuando aparezcan la Acrópolis y sus templos, fíjate en lo que se conserva. Luego escucha hablar de los dioses del Olimpo.',
      check: 'Elige un dios y explica cómo lo honraban los griegos. Puedes usar el templo, una ofrenda o los juegos como ejemplo.',
    }],
  },
  legacy: {
    slug: 'legado-griego',
    title: 'El legado griego: antes y hoy',
    summary: 'Compara teatro, juegos, arquitectura y formas de participar.',
    image: 'premium/assets/curriculum/athenian-assembly.jpg',
    alt: 'Un orador habla en una ladera mientras varias personas levantan la mano.',
    caption: 'Una asamblea de Atenas · Recreación artística',
    ideas: [
      ['¿Qué es un legado?', 'Es algo del pasado que otras personas reciben y pueden transformar. En los teatros griegos, el público miraba desde gradas al aire libre. Hoy también vemos actores frente a un público, incluso en salas cerradas. Las columnas de sus templos inspiraron edificios posteriores.'],
      ['Juegos que cambiaron', 'En Olimpia había pruebas como las carreras a pie. El premio era una corona de olivo. En los Juegos Olímpicos actuales también hay carreras y se entregan medallas.'],
      ['Decidir juntos', 'Democracia viene de demos, que significa pueblo, y kratos, que significa poder. En Atenas, los hombres adultos con ciudadanía podían hablar y votar en la asamblea. Las mujeres, las personas extranjeras y las esclavizadas quedaban fuera.'],
    ],
    prompt: 'Escoge un ejemplo y completa: «Antes… Hoy… En ambos…». Puedes explicarlo hablando o dibujando.',
    links: [['apps/olympia/', 'Comparar los Juegos Olímpicos', 'olive']],
    videos: [{
      id: 'NKVtRYMWuEg', anchor: 'democracia', title: 'El nacimiento de la democracia', duration: '7 min 30 s',
      moments: [[165, 'Qué significa democracia'], [305, 'Cómo era la asamblea'], [405, 'Una votación actual']],
      cue: 'Observa quiénes podían participar en la asamblea de Atenas. Al final, fíjate en la urna de una votación actual.',
      check: 'Imagina que tu curso elige un cuento para leer. ¿Cómo escucharán las ideas? ¿Quiénes podrán votar? Explica una semejanza y una diferencia con la asamblea de Atenas.',
    }, {
      id: '5J5uJeKpdwI', title: 'Civilización griega, legado y comparación con la actualidad', duration: '7 min 9 s',
      moments: [[135, 'Templo de columnas'], [290, 'Gradas del teatro']],
      cue: 'Fíjate en el templo con columnas y en las gradas del teatro. Busca algún lugar actual que cumpla una función parecida.',
      check: 'Compara el teatro antiguo con uno actual: ¿qué hacen los actores y el público en los dos? ¿Qué cambia en el espacio?',
    }],
  },
  source: {
    slug: 'investigar',
    title: 'Investigar el pasado',
    summary: 'Distingue lo que ves y lo que puedes averiguar con una fuente.',
    image: 'premium/assets/sources/met-amphora-248662.jpg',
    imageSize: [600, 600],
    alt: 'Vasija con dos asas y figuras oscuras sobre un fondo anaranjado.',
    caption: 'Ánfora griega · The Met, 12.198.4 · Dominio público',
    ideas: [
      ['Lo que puedes observar', 'En la fotografía del ánfora se ven sus asas y figuras pintadas. Un ánfora es una vasija con dos asas.'],
      ['Lo que dice la ficha', 'La ficha del museo cuenta que es de terracota, o barro cocido, y da una fecha aproximada. Puedes usar la foto y la ficha para explicar cosas distintas sobre la misma pieza.'],
    ],
    prompt: 'Completa «Veo…», «La ficha dice…» y «Todavía me pregunto…». Cuéntaselo a alguien o escríbelo en el cuaderno.',
  },
};

export const unitSource = 'https://www.curriculumnacional.cl/docente/629/w3-article-21074.html';
export const publicVideoSource = 'https://www.cormudesi.cl/Padems/PADEM%202022.pdf';

export function chapterIndex(units, hash) {
  const anchor = hash.slice(1);
  if (!anchor) return -1;
  return units.findIndex(({id}) => {
    const chapter = chapters[id];
    return chapter.slug === anchor || chapter.videos?.some(video => video.anchor === anchor);
  });
}
