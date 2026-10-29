// Positions match the uncropped 3:2 didactic landscape, expressed as percentages.
export const cityPlaces={
 port:{name:'Puerto',icon:'anchor',x:26,y:53,place:'Costa'},
 homes:{name:'Casas',icon:'city',x:54,y:40,place:'Viviendas'},
 farms:{name:'Cultivos',icon:'olive',x:80,y:25,place:'Campos'},
 agora:{name:'Ágora',icon:'city',x:28,y:22,place:'Plaza'},
 temple:{name:'Templo',icon:'temple',x:57,y:12,place:'Colina'},
 theatre:{name:'Teatro',icon:'gods',x:83,y:61,place:'Ladera'}
};
export const cityRoadPaths={
 'port-homes':'M260 530 C340 500 420 430 540 400',
 'farms-homes':'M800 250 C730 320 670 370 540 400',
 'agora-homes':'M280 220 C360 240 420 340 540 400',
 'temple-homes':'M570 120 C640 220 620 300 540 400',
 'theatre-homes':'M830 610 C760 530 670 450 540 400'
};
export function deliveryStatus(city,sea={}){
 const linked=id=>city.placed.includes(id)&&city.placed.includes('homes')&&city.roads.includes(id+'-homes');
 const exchanged=sea.route==='islands'&&sea.response==='shelter'&&sea.supplies?.includes('trade');
 return [
  {id:'port',from:'Puerto',product:exchanged?'Grano del intercambio':'Aceite del viaje',icon:'amphora',connected:linked('port')},
  {id:'farms',from:'Cultivos',product:'Trigo de los campos',icon:'wheat',connected:linked('farms')}
 ];
}
