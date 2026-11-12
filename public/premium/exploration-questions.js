// Answer positions and the revision travel with saved discoveries.
export const explorationQuestions = {
  templo: {
    theme: 'Arquitectura',
    observe: 'Compara la ilustración del templo con la foto del Partenón.',
    question: '¿Qué imagen muestra restos de un templo real?',
    options: ['La ilustración del templo', 'La foto del Partenón', 'Las dos imágenes'],
    hint: 'Pista: busca la imagen rotulada «Fotografía».',
    responses: [
      'La ilustración ayuda a imaginar cómo se veía un templo. Busca la fotografía.',
      'En la foto vemos columnas y otras partes del Partenón que aún se conservan.',
      'Las dos muestran templos. Solo la fotografía registra los restos de un edificio real.',
    ],
  },
  altar: {
    theme: 'Vida en el santuario',
    observe: 'Mira qué llevan las personas al altar: frutos, flores y vasijas.',
    question: '¿Qué era una ofrenda en un santuario?',
    options: ['Un relato sobre los dioses', 'Un asiento para descansar', 'Un regalo dedicado a una divinidad'],
    hint: 'Pista: piensa para qué llevaban los objetos al altar.',
    responses: [
      'Los relatos contaban historias. Las ofrendas eran regalos, como los frutos que ves junto al altar.',
      'En el altar se dejaban regalos. La gente podía ofrecer frutos, alimentos o vasijas.',
      'Las personas dejaban regalos en el altar para honrar a una divinidad.',
    ],
  },
  olivo: {
    theme: 'Alimentos y trabajo',
    observe: 'Sigue la cosecha y la prensa. En el relato de Atenea, el regalo es el olivo.',
    question: '¿Qué fruto del olivo se usaba para hacer aceite?',
    options: ['La aceituna', 'La uva', 'El higo'],
    hint: 'Pista: el nombre de este fruto se parece a la palabra «aceite».',
    responses: [
      'Al prensar las aceitunas se obtiene aceite. Por eso el olivo era útil en la vida diaria.',
      'De la uva se puede obtener jugo. Busca el fruto que crece en el olivo.',
      'El higo crece en la higuera. Busca el fruto que se cosecha en el olivar.',
    ],
  },
  puerto: {
    theme: 'Navegación y comercio',
    observe: 'Fíjate en las ánforas. Son las vasijas que ves en el muelle y a bordo.',
    question: '¿Para qué llevaban ánforas en el barco?',
    options: ['Para orientar el barco', 'Para transportar productos como aceite', 'Para impulsar la vela'],
    hint: 'Pista: piensa qué se puede guardar dentro de una vasija.',
    responses: [
      'Para guiar el barco se usaban remos de gobierno. Las ánforas llevaban la carga.',
      'Las ánforas permitían llevar productos, como aceite, de un puerto a otro.',
      'El viento mueve la vela. Las ánforas sirven para llevar productos.',
    ],
  },
};
