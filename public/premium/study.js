import {gods} from './content.js';
export const godIds=new Set(gods.map(g=>g.id));
export function normalizeMastery(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return {};
 return Object.fromEntries(Object.entries(raw).filter(([id,v])=>godIds.has(id)&&v&&typeof v==='object').map(([id,v])=>[id,{attempts:Math.max(0,Math.min(100000,Math.floor(Number(v.attempts)||0))),correct:Math.max(0,Math.min(Math.floor(Number(v.attempts)||0),Math.floor(Number(v.correct)||0),100000))}]));
}
export function recordReview(mastery,id,correct){
 const next=normalizeMastery(mastery);if(!godIds.has(id))return next;
 const prev=next[id]||{attempts:0,correct:0};next[id]={attempts:prev.attempts+1,correct:prev.correct+(correct?1:0)};return next;
}
export function createDeck(mastery={},seed=Date.now()){
 let n=seed>>>0;const rand=()=>{n=(Math.imul(1664525,n)+1013904223)>>>0;return n/4294967296;};
 const shuffled=values=>values.map(v=>({v,r:rand()})).sort((a,b)=>a.r-b.r).map(x=>x.v);
 const m=normalizeMastery(mastery);
 return shuffled(gods).sort((a,b)=>((m[a.id]?.correct||0)/((m[a.id]?.attempts||0)+1))-((m[b.id]?.correct||0)/((m[b.id]?.attempts||0)+1))).slice(0,5).map((g,i)=>({id:g.id,kind:i%2?'domain':'symbol',clue:i%2?g.domain:g.symbol,options:shuffled([g,...shuffled(gods.filter(x=>x.id!==g.id)).slice(0,2)]).map(x=>({id:x.id,name:x.name})),explanation:g.evidence}));
}
