// Each reading owns its callbacks; cancelled readings cannot change a newer one.
export function createVoice({synthesis,Utterance,onChange=()=>{},onUnavailable=()=>{},onError=()=>{}}){
 let current=null;
 const stop=()=>{current=null;onChange(false);try{synthesis?.cancel();}catch{}};
 const speak=text=>{
  stop();
  if(!synthesis||!Utterance){onUnavailable();return;}
  try{
   const u=new Utterance(text);current=u;u.lang='es-CL';u.rate=.88;
   const settle=error=>{if(current!==u)return;current=null;onChange(false);if(error&&!['canceled','interrupted'].includes(error))onError();};
   u.onend=()=>settle();u.onerror=e=>settle(e.error||'unknown');
   onChange(true);synthesis.speak(u);
  }catch{current=null;onChange(false);onError();}
 };
 return {speak,stop,get active(){return current!==null;}};
}
