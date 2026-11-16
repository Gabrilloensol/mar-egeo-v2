// Only a fixed, local destination is accepted; query text is never used as a URL.
export function setupAdventureReturn(root,search){
 const origin=new URLSearchParams(search).get('volver');
 const fromAdventure=origin==='aventura'||origin==='creencias';
 for(const link of root.querySelectorAll('[data-adventure-return]')){
  link.hidden=!fromAdventure;
  link.setAttribute('href',origin==='creencias'?'apps/learning-adventure/?unidad=1#vida-y-creencias':'apps/learning-adventure/');
  if(origin==='creencias')link.textContent='← Volver a vida diaria y creencias';
 }
 return fromAdventure;
}
