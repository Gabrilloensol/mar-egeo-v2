// Labels describe completed choices, never infer mastery or grade free writing.
export function discoveryCards(state,id){
 const r=state.records?.[id];
 if(!state.completed.includes(id)||!r)return [];
 if(id==='sea')return [
  {icon:'map',label:'Mi ruta',text:r.route==='islands'?'Entre islas':'Por mar abierto'},
  {icon:'sail',label:'Llevé',text:r.supplies.map(x=>({water:'Agua',sail:'Vela de repuesto',trade:'Espacio libre'}[x])).join(' + ')},
  {icon:r.response==='shelter'?'anchor':'sail',label:'Lo que ocurrió',text:r.response==='shelter'?(r.supplies.includes('trade')?'Cambié aceite por grano en el puerto':'Esperé en un puerto'):(r.supplies.includes('sail')?'Usé la vela de repuesto':'Continué más despacio')}
 ];
 if(id==='city')return [
  {icon:'anchor',label:'Conecté',text:'Puerto → Casas'},
  {icon:'wheat',label:'Conecté',text:'Cultivos → Casas'},
  {icon:'city',label:'Llegaron',text:r.portCargo==='grain'?'Grano del puerto y trigo del campo':r.portCargo==='oil'?'Aceite del puerto y trigo del campo':'Alimentos a las casas'}
 ];
 return [
  {icon:'eye',label:'Vi',text:'Un barco y un recipiente'},
  {icon:'sail',label:'Relacioné',text:'Los barcos pueden llevar productos'},
  {icon:'question',label:'Nos falta saber',text:'La fecha de un viaje real'}
 ];
}
