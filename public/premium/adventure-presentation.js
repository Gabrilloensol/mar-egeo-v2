// A finite response to a new decision, never an ambient animation loop.
export function createPresentation(doc){
 let lastScreen='',last=new Set();
 return ({screen,chapter,reduced})=>{
  doc.body.dataset.chapter=chapter;doc.body.dataset.view=screen.split(':')[0];
  const targets=[...doc.querySelectorAll('[data-motion-key]')].filter(el=>el.matches('.active,.selected,.connected,.delivered,[aria-pressed="true"]')||el.matches('.city-node:not(.empty)'));
  const current=new Set(targets.map(el=>el.dataset.motionKey));
  if(!reduced){
   if(screen!==lastScreen){doc.querySelector('.scene')?.classList.add('scene-intro');doc.querySelector('.complete-seal')?.classList.add('reward-entry');}
   else for(const el of targets)if(!last.has(el.dataset.motionKey))el.classList.add('decision-reveal');
  }
  last=current;lastScreen=screen;
 };
}
