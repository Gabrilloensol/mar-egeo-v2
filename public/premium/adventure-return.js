// Only a fixed, local destination is accepted; query text is never used as a URL.
export function setupAdventureReturn(root,search){
 const fromAdventure=new URLSearchParams(search).get('volver')==='aventura';
 for(const link of root.querySelectorAll('[data-adventure-return]')){
  link.hidden=!fromAdventure;
  link.setAttribute('href','apps/learning-adventure/');
 }
 return fromAdventure;
}
